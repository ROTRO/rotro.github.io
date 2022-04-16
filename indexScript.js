function downloadCV() {
var link=document.createElement('a');
document.body.appendChild(link);
link.href='./assets/CV/CV.pdf' ;
link.download='CV' ;
link.click();
  }
