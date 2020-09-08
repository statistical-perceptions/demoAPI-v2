from math import erf, sqrt
import numpy as np
# import matplotlib.pyplot as plt
import json
import sys

# # define constants

# mu = 979.8    # mean = 978.8 
# sigma = 73.1  # standard deviation = 73.1 
# x1 = 900      # lower bound = 900 
# x2 = 1100     # upper bound = 1100 

# # calculate probability

# # probability from Z=0 to lower bound
# double_prob = erf( (x1-mu) / (sigma*sqrt(2)) )
# p_lower = double_prob/2
# print(f'\n Lower Bound: {round(p_lower,4)}')

# # probability from Z=0 to upper bound
# double_prob = erf( (x2-mu) / (sigma*sqrt(2)) )
# p_upper = double_prob/2
# print(f'\n Upper Bound: {round(p_upper,4)}')

# # print the results

# Pin = (p_upper) - (p_lower)
# print('\n')
# print(f'mean = {mu}    std dev = {sigma} \n')
# print(f'Calculating the probability of occurring between {x1} <--> {x2} \n')
# print(f'inside interval Pin = {round(Pin*100,1)}%')
# print(f'outside interval Pout = {round((1-Pin)*100,1)}% \n')
# print('\n')

def normal(x,mu,sigma):
    """
    @x: observed value
    @mu: mean of true population
    @sigma: standard deviation of true population
    
    Returns the height on the normal distribution of any observation supplied.
    """
    
    denom = sigma * np.sqrt(2*np.pi)
    inner = -1*(x-mu)**2/2*sigma**2
    num = np.exp(inner)
    return num/denom

def calculate_regions(mu=0,sigma=1,height=20,length=16):
    """
    @mu: mean of true population
    @sigma: standard deviation of true population
    @height: maximum height of the graph
    @length: number of columns
    
    Returns the heights on the normal distribution.
    Altered so that the maximum height is @height and the number of columns is @length
    """

    division = 8.0 / length
    # print(length, division)
    # heights = [estimate_normal(start=i,stop=i + division) for i in np.linspace(-4,4,length)]
    heights = []

    for i in np.linspace(-4,4 - division,length):
        X = np.linspace(i, i + division, 10)
        tups = [(x_elem,normal(x=x_elem,mu=mu,sigma=sigma)) for x_elem in X]
        # print(X)
        # print(tups)

        area = 0
        for idx in range(0, 10):
            curr_tup = tups[idx]
            curr_x = curr_tup[0]
            curr_y = curr_tup[1]
            prev_tup = tups[idx-1]
            prev_x = prev_tup[0]
            prev_y = prev_tup[1]
            width = np.sqrt((curr_x - prev_x)**2)
            # print(curr_x, prev_x)
            avg_height = (curr_y + prev_y)/2
            area += width*avg_height

        heights.append(area)


    max_val = max(heights)
    multiplier = height / max_val
    final_heights = [int(round(height * multiplier)) for height in heights]

    output = {}

    for i, height in enumerate(final_heights):
        output[str(i)] = height

    return output

def remove_zeroes(input_data):
    """
    Remove all columns with a height of zero from given data
    """
    output_data = {}
    position = 0

    for _, value in input_data.items():
        if value != 0:
            output_data[str(position)] = value
            position += 1
    
    return output_data

args = sys.argv

height_1 = int(sys.argv[1]) #int(input('What is the height of the first curve? '))
width_1 = int(sys.argv[2]) #int(input('What is the width of the first curve? '))
height_2 = int(sys.argv[3]) #int(input('What is the height of the second curve? '))
width_2 = int(sys.argv[4]) #int(input('What is the width of the second curve? '))
radius = int(sys.argv[5]) #int(input('What is the radius of each circle (minimum is 2, maximum is 5) '))
axis_length = int(sys.argv[6]) #int(input('What is the default length of the x-axis (at least 1, default is 30) '))
low_val = int(sys.argv[7]) #int(input("What is the value of the lowest value of our x-axis? (the highest value will be the lowest value + the length of the axis) "))

try:
    visible_width_1 = width_1
    visible_width_2 = width_2

    height_vals_1 = calculate_regions(height=height_1, length=width_1)

    height_vals_2 = calculate_regions(height=height_2, length=width_2)

    # Make sure that there are no 0 height columns and the length is the requested length

    height_vals_1 = remove_zeroes(height_vals_1)
    while (len(height_vals_1) != width_1):
        visible_width_1 += 1
        height_vals_1 = calculate_regions(height=height_1, length=visible_width_1)
        height_vals_1 = remove_zeroes(height_vals_1)

    height_vals_2 = remove_zeroes(height_vals_2)
    while (len(height_vals_2) != width_2):
        visible_width_2 += 1
        height_vals_2 = calculate_regions(height=height_2, length=visible_width_2)
        height_vals_2 = remove_zeroes(height_vals_2)

    # End checking for zeroes

    data = {}

    len1 = len(height_vals_1)
    len2 = len(height_vals_2)

    data["colValHeiS"] = height_vals_1
    data["colValHeiS2"] = height_vals_2
    data["len1"] = len1
    data["len2"] = len2

    overlapVals = {}

    difference = len2 - 1

    for i in range(0, difference + len1):
        val = 0
        # print("i is ", i)
        for j in range(i, i + len2):
            # print("j is ", j)
            if str(j - difference) in height_vals_1 and str(j - i) in height_vals_2:
                if height_vals_1[str(j - difference)] < height_vals_2[str(j - i)]:
                    val += height_vals_1[str(j - difference)]
                else:
                    val += height_vals_2[str(j - i)]
        overlapVals[str(i)] = val

    data["overlapVals"] = overlapVals

    data["max-height"] = max(height_1, height_2)
    data["circle-radius"] = radius
    data["axis-length"] = axis_length

    startPos1 = len2 + 1
    startPos2 = (len1 + len2 + 4)

    data["startPos1"] = startPos1
    data["startPos2"] = startPos2
    data["lowVal"] = low_val

    # with open('inputDataPy.json', 'w') as outfile:
    #     json.dump(data, outfile)

    print(data)
    sys.stdout.flush()

except:
    print('Those are not valid values')
