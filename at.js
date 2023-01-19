function loopingDetection(batch) {
    let values = [];
    for (const obj of batch) {
        for (const [key, value] of Object.entries(obj)) {
            values.push(value)
        }
    }

    let FLAGS = ["POSSIBLY", "LIKELY","VERY_LIKELY"];

    let result = FLAGS.some(i => values.includes(i));

    if (result == true)
        return "HARMFULL"
        else{
            return "HEALTHY"
        }

}

const batch = [
    {
        "adult": "POSSIBLY",
        "spoof": "VERY_UNLIKELY",
        "medical": "VERY_UNLIKELY",
        "violence": "VERY_UNLIKELY",
        "racy": "VERY_UNLIKELY"
    },
    {
        "adult": "UNLIKELY",
        "spoof": "VERY_UNLIKELY",
        "medical": "UNLIKELY",
        "violence": "VERY_UNLIKELY",
        "racy": "LIKELY"
    },
    {
        "adult": "UNLIKELY",
        "spoof": "VERY_UNLIKELY",
        "medical": "UNLIKELY",
        "violence": "VERY_UNLIKELY",
        "racy": "LIKELY"
    }
]

const health = loopingDetection(batch)
console.log(health)