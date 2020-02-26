/**
 * Will essentially completely clear a div of all of its content.
 * End result will be a completely blank canvas to throw anything onto.
 */
function clearDiv(){
  //Set the div to clear as a variable.
  var divToClear = document.getElementById('second-screen-container');

  //While the div still exists, clear any child.
  while(divToClear.firstChild){
   divToClear.removeChild(divToClear.firstChild);
  }
}