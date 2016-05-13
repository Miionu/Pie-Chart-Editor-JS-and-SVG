var colors = ["#009688", "#ff8a80", "#795548", "#e53935", "#dce775", "#00acc1", "#00e676", "#bcaaa4", "#9c27b0", "#b9f6ca", "#e6ee9c", "#607d8b", "#ff9800"];

function showBox() {
    var box = document.getElementById("show");
    if (box.className == "show") {
        box.className = "hidden";
    }
    else {
        box.className = "show";
    }
}

function addRow() {
  var table = document.getElementById("table");
  if (table.rows.length < 15) {
      var positionRow = table.rows.length - 1;
      var newRow = table.insertRow(positionRow);
      newRow.innerHTML = '<td contenteditable="true" class="content" placeholder="title"></td><td contenteditable="true" class="content" placeholder="value"></td>';
  }
}
function removeRow() {
    var table = document.getElementById("table");
    if (table.rows.length > 3) {
        var numberRow = table.rows.length - 2;
        table.deleteRow(numberRow);
    }
}
function refresh() {
    removeElementsByClass("path");
    
    var cells = document.getElementsByClassName("content");
    var table = new Array();
    for (i = 0; i < cells.length; i++) { // We can simplify the code here (i += 2)
        table.push(cells[i].innerHTML);
    }
    var total = 0;
    var condition = false;
    for (i = 1; i <= table.length; i += 2) {
        table[i] = table[i].replace(/<\/?[^>]+(>|$)/g, "");
        document.getElementById("error-message").innerHTML = "<p>One of the values is invalid.</p>";
        condition = false;
        if (isNaN(table[i]) || Number(table[i]) < 0 || Number(table[i]) > 100)  {break;}
        document.getElementById("error-message").innerHTML = "";
        total += Number(table[i]);
        condition = true;
    }
    if (condition) {
        if (total != 100) {
            document.getElementById("error-message").innerHTML = "<p>Total isn't 100.</p>";
        }
        else {
            document.getElementById("error-message").innerHTML = "";
            var list = new Array();
            for (i = 1; i <= table.length; i += 2) {
                list.push(Number(table[i]));
            }
            createPie(list);
            
            createLegend(table);
        }
    }
}

function createPath(d, fill) {
    var path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
    path.setAttributeNS(null, "d", d);
    path.setAttributeNS(null, "fill", fill);
    path.setAttributeNS(null, "class", "path");
    return path;
}
function createPie(list) {
    var x1 = 300;
    var y1 = 150;
    var angle = 0;
    for (i = 0; i < list.length; i++) {
        if (list[i] == 100) {
            document.getElementById("circle").style.fill = "#009688";
        }
        else {
            var angle = angle + (3.6 * list[i] * Math.PI / 180);
        var x2 = 150 + Math.cos(angle) * 150;
        var y2 = 150 + Math.sin(angle) * 150;
        if (list[i] > 50) {
            var d = "M150 150 L" + x1 + " " + y1 +" A150,150 0 1,1 " + x2 + "," + y2 + "Z";
        }
        else {
            var d = "M150 150 L" + x1 + " " + y1 +" A150,150 0 0,1 " + x2 + "," + y2 + "Z";
        }
        
        var fill = colors[i];
        var path = createPath(d, fill);
        document.getElementById("pie").appendChild(path);
        x1 = x2;
        y1 = y2;
        }
    }
}
function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}
function createLegend (table) {
    removeElementsByClass("legend-item");
    for (i = 0; i < table.length; i += 2) {
        var li = document.createElement('li');
        li.innerHTML = '<span class="before-legend-item"></span>' + table[i];
        li.setAttribute("class", "legend-item");
        document.getElementById("legend").appendChild(li);
    }
    var legend = document.getElementsByClassName("before-legend-item");
    for (i = 0; i < legend.length; i++) {
        legend[i].style.background = colors[i];
    }
}