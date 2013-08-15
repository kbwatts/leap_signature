// Setup Leap loop with frame callback function
var controllerOptions = { enableGestures: true },
    width = 900,
    height = 400,
    canvas = d3.select('div#container')
        .append('canvas')
        .attr('width', width)
        .attr('height', height).node(),
    ctx = canvas.getContext('2d'),
    before = {},
    after = {},
    color = d3.scale.category20();

ctx.lineWidth = 1;
ctx.translate(width/2, height/2);



function draw() {
    var a, b;

    for (var id in after) {
        b = before[id],
        a = after[id];
        if (!b) continue;

        ctx.strokeStyle = color(000000);
        ctx.moveTo(b.tipPosition.x, -b.tipPosition.y);
        ctx.lineTo(a.tipPosition.x, -a.tipPosition.y);
        ctx.stroke();
        ctx.beginPath();
    }

    before = after;


}

Leap.loop(controllerOptions, function(frame, done) {
    after = {};

    for (var i = 0; i < frame.pointables.length; i++) {
        after[frame.pointables[0].id] = frame.pointables[0];
    }

    // Erase contents after a deliberate gesture (in this case, circles)
    for (var i = 0; i < frame.gestures.length; i++) {
        var gesture = frame.gestures[i];
        //document.write(gesture.type);
        // could make it erase with a fast swipe instead
        // if ((gesture.type === "swipe") && (gesture.speed > 2000)) {
        if ((gesture.type === "circle") && (gesture.duration > 800000)) {

            // Store the current transformation matrix
            ctx.save();

            // Use the identity matrix while clearing the canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Restore the transform
            ctx.restore();
        }
    }



    draw();
    done();
});
