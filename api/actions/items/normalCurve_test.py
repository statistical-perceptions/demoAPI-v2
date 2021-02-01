from math import erf, sqrt
import numpy as np

import json

#Test tool import
import pytest

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

def test_answer():
    assert normal(1000, 979.8, 73.1) == 0