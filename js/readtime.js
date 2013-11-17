var container = $("#demotxt"),
    _sentenceEndExp = /(\.|\?|!)$/g, //regular expression to sense punctuation that indicates the end of a sentence so that we can adjust timing accordingly
    startBtn = $("#start-anim"),
    time = 0,
    duration, element;

startBtn.on("click", startAnimation);

function startAnimation(){

  //this function just takes a string of text and splits it into an array based on the maximum length (of characters including spaces) that should be allowed to exist in each line, and when it encounters the end of a sentence (ending in ".", "?", or "!"), it will force a line break too.
  function buildChunks(text, maxLength) {
    if (maxLength === undefined) {
      return text.split(" ");
    }
    var words = text.split(" "),
        wordCount = words.length,
        chunk = [],
        chunks = [], i;
    for (i = 0; i < wordCount; i++){
      chunk.push(words[i]);
      if (_sentenceEndExp.test(words[i]) || i === wordCount - 1 || chunk.join(" ").length + words[i+1].length > maxLength) {
        chunks.push(chunk.join(" "));
        chunk = [];
      }
    }
    return chunks;
  }

  function deliverText(chunks, maxLength) {
    //in case "chunks" isn't an array, we'll build chunks automatically
    if (!(chunks instanceof Array)) {
      chunks = buildChunks(chunks, maxLength);
    }
    
    var chunk, isSentenceEnd, i;
    // var tl = new TimelineMax(),
    //     time = 0,
    //     chunk, element, duration, isSentenceEnd, i;
    
    for (i = 0; i < chunks.length; i++) {
      chunk = chunks[i];
      isSentenceEnd = _sentenceEndExp.test(chunk) || (i === chunks.length - 1);
      element = $("<p>" + chunk + "</p>").appendTo(container);
        duration = Math.max(0.5, chunk.length * 0.08); //longer words take longer to read, so adjust timing. Minimum of 0.5 seconds.
        if (isSentenceEnd) {
          duration += 0.6; //if it's the last word in a sentence, drag out the timing a bit for a dramatic pause.
        }

        doAnimation();

        time += duration - 0.05;
        if (isSentenceEnd) {
          time += 0.6; //at the end of a sentence, add a pause for dramatic effect.
        }
      }

  }

  deliverText("Ut sed vel arcu turpis sed tincidunt dictumst scelerisque scelerisque amet cum habitasse purus egestas eu pulvinar integer integer tortor augue lundium amet Montes enim Ultricies turpis ad egestas sociis tincidunt, enim ultrics sed amet etiam cursus urna dictumst rhoncus lectus diam ultricies aliquam augue lectus turpis aliquet lorem urna.", 340);

}

function doAnimation(){
  var tl = new TimelineMax();
    //set opacity and scale to 0 initially. We set z to 0.01 just to kick in 3D rendering in the browser which makes things render a bit more smoothly.
  TweenLite.set(element, {autoAlpha:0, scale:0, z:0.01});
  //the SlowMo ease is like an easeOutIn but it's configurable in terms of strength and how long the slope is linear. See http://www.greensock.com/v12/#slowmo and http://api.greensock.com/js/com/greensock/easing/SlowMo.html
  tl.to(element, duration, {scale:1.5,  ease:SlowMo.ease.config(0.25, 0.9)}, time)
    //notice the 3rd parameter of the SlowMo config is true in the following tween - that causes it to yoyo, meaning opacity (autoAlpha) will go up to 1 during the tween, and then back down to 0 at the end. 
    .to(element, duration, {autoAlpha:1, ease:SlowMo.ease.config(0.25, 0.9, true)}, time);
}



