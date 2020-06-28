const data = {
    "_id": {
        "$oid": "5eebd644e7179a6b636c311f"
    },
    "userID": "should appear when you GET from /api/feedback",
    "sliderVal": "good"
}

console.log(data["_id"]["$oid"])
console.log(data._id.$oid)