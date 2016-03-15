/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/
'use strict';

var surfaceN = parseInt(readline()); // the number of points used to draw the surface of Mars.

var surfaceArr = [];

for (var i = 0; i < surfaceN; i++) {
    surfaceArr.push(readline());
}

const g = 3.711; // gravity power of Mars
const engineThrustPowerPerEngineLevel = 1;
const fuelConsumptionPerEngineLevel = 1;
const requiredFuelLevel = 300;
const maxSpeedForLanding = 39;
const minEngineAcc = 0;
const maxEngineAcc = 4;

var landingHeigh;
var previousSurfaceX;
var surfaceX;
var surfaceY;
var currentLevel = 0;
var levelOfFuelWeCanSpend;

// game loop
while (true) {
    var inputs = readline().split(' ');
    var X = parseInt(inputs[0]);
    var Y = parseInt(inputs[1]);
    var hSpeed = parseInt(inputs[2]); // the horizontal speed (in m/s), can be negative.
    var vSpeed = parseInt(inputs[3]); // the vertical speed (in m/s), can be negative.
    var fuel = parseInt(inputs[4]); // the quantity of remaining fuel in liters.
    var rotate = parseInt(inputs[5]); // the rotation angle in degrees (-90 to 90).
    var power = parseInt(inputs[6]); // the thrust power (0 to 4).
    var engineOutput = '0 ';

    if (levelOfFuelWeCanSpend === undefined) {
        levelOfFuelWeCanSpend = fuel - requiredFuelLevel;
    }

    if (surfaceX === undefined && surfaceY === undefined) {
        for (var i = 0; i < surfaceN; i++) {
            var surfacePoint = surfaceArr[i].split(' ');
            surfaceX = parseInt(surfacePoint[0]); // X coordinate of a surface point. (0 to 6999)

            if (X < surfaceX && X > previousSurfaceX) {
                surfaceY = parseInt(surfacePoint[1]);
                break;
            }

            previousSurfaceX = surfaceX;
        }
    }

    landingHeigh = Math.abs(surfaceY - Y); //More complex, but unneeded Math.sqrt(Math.pow((X - surfaceX),2) + Math.pow((Y - surfaceY),2));

    // Using free fall and acceleration formulas from Physics:
    // This formula was created to identify speed at the moment of landing for a gived height, speed and engine thrust of the mars lander
    var spd = Math.sqrt(2 * landingHeigh * (engineThrustPowerPerEngineLevel * maxEngineAcc - g) + Math.pow(vSpeed, 2));

    if (spd >= maxSpeedForLanding) {
        currentLevel = maxEngineAcc;
        levelOfFuelWeCanSpend -= currentLevel * fuelConsumptionPerEngineLevel;
    }
    else {
        currentLevel = 0;
    }

    print(engineOutput + currentLevel);
}