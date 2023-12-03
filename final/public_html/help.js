var homeButton = document.getElementById("homeButton")
var helpSubject = document.getElementsByClassName("helpSubject");

for (i = 0; i < helpSubject.length; i++) {
    helpSubject[i].addEventListener("click", function() {
      this.classList.toggle("active");
      var content = this.nextElementSibling;
      if (content.style.maxHeight){
        content.style.maxHeight = null;
      } else {
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  }

homeButton.onclick = () =>{
    window.location.href = "http://localhost:80/home.html"
}