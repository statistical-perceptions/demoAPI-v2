// const data = {
//     "_id": {
//         "$oid": "5eebd644e7179a6b636c311f"
//     },
//     "userID": "should appear when you GET from /api/feedback",
//     "sliderVal": "good"
// }

// console.log(data["_id"]["$oid"])
// console.log(data._id.$oid)

const data = [
    {
        "_id": "5eff558c7a68e76660b3572a",
        "userID": "Fri Jul 03 2020 11:58:04 GMT-0400 (Eastern Daylight Time)",
        "exptName": "experiment1",
        "q0": {
            "Type": "slider",
            "Question": "pick a number",
            "lowRange": "0",
            "highRange": "100"
        },
        "count": 1,
        "type": "experiment"
    },
    {
        "_id": "5eff55ed7a68e76660b3572b",
        "userID": "Fri Jul 03 2020 11:59:40 GMT-0400 (Eastern Daylight Time)",
        "exptName": "experiment2",
        "q0": {
            "Type": "slider",
            "Question": "select value",
            "lowRange": "0",
            "highRange": "50"
        },
        "q1": {
            "Type": "slider",
            "Question": "select another value",
            "lowRange": "0",
            "highRange": "50"
        },
        "count": 2,
        "type": "experiment"
    }
]

console.log(data[0].exptName);