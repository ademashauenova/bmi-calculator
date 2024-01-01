const express = require('express');
const router = express.Router();

const bmiHistory = [];

router.route('/')
    .get((req, res) => {
        res.sendFile(__dirname + '/../views/index.html');
    })
    .post((req, res) => {
        const height = parseFloat(req.body.height);
        const weight = parseFloat(req.body.weight);
        const age = parseInt(req.body.age);
        const gender = req.body.gender;
        const heightUnit = req.body.heightUnit || 'cm';
        const weightUnit = req.body.weightUnit || 'kg';

        const heightInCM = heightUnit === 'in' ? height * 2.54 : height;
        const weightInKG = weightUnit === 'lb' ? weight * 0.453592 : weight;

        if (isNaN(heightInCM) || isNaN(weightInKG) || isNaN(age) || heightInCM <= 0 || weightInKG <= 0 || age <= 0) {
            return res.send('Invalid input. Please enter valid numbers for height, weight, and age.');
        }

        const bmi = calculateBMI(heightInCM, weightInKG, age, gender);
        const interpretation = interpretBMI(bmi);

        const historyItem = {
            height,
            weight,
            age,
            gender,
            heightUnit,
            weightUnit,
            bmi: bmi.toFixed(2),
            interpretation,
            timestamp: new Date().toLocaleString(),
        };

        bmiHistory.push(historyItem);

        res.send(`Your BMI is: ${bmi.toFixed(2)}. ${interpretation}`);
    });

function calculateBMI(height, weight, age, gender) {
    const heightInMeters = height / 100;

    const bmi = weight / (heightInMeters * heightInMeters);

    const ageFactor = age < 18 ? 0.9 : 1.0; 
    const genderFactor = gender === 'female' ? 0.95 : 1.0;

    return bmi * ageFactor * genderFactor;
}

function interpretBMI(bmi) {
    if (bmi < 18.5) {
        return 'You are underweight.';
    } else if (bmi >= 18.5 && bmi < 24.9) {
        return 'You have a healthy weight.';
    } else if (bmi >= 25 && bmi < 29.9) {
        return 'You are overweight.';
    } else {
        return 'You are obese.';
    }
}

router.get('/history', (req, res) => {
    res.json(bmiHistory);
});

module.exports = router;