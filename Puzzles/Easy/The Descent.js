/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/


// game loop
while (true) {
    // index of mountain to attach
    var mountainToAttack;
    // last largest value for the mountain height
    var lastMountain;

    for (var i = 0; i < 8; i++) {
        if (i > 0) {
            var currentMountain = parseInt(readline());
            /* verify next mountain height value, if its bigger assign it to be next biggest mountain value 
               And set its index to be the one we want to attach 
            */
            if (lastMountain < currentMountain) {
                mountainToAttack = i;
                lastMountain = currentMountain;
            }
        }
        // set first mountain received to be default index and biggest mountain value
        else {
            mountainToAttack = i;
            lastMountain = parseInt(readline());
        }
    }

    print(mountainToAttack);
}