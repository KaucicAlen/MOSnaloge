
let stAlternativ = 2;
let id = 0;
let array = [];
let poljaAlternativ = [];
let poljaUtezi = [];
let poljaParametri = [];
let poljeVrednosti = [];
let stVrstic = 0;
let poljeObjekti = [];

function createTable() {

    document.getElementById("tabela").innerHTML = "";
    let tabela = document.createElement("TABLE");
    tabela.setAttribute("id", "tabela1");

    for (let i = 0; i < 2; i++) {
        let tr = document.createElement("tr");
        tabela.appendChild(tr);
        for (let j = 0; j < 2; j++) {
            let td = document.createElement("td");

            if (j == 0 && i == 0) {
                td.innerHTML = "Parametri";
                tr.appendChild(td);
            }
            else if (j == 0 && i != 0) {
                td.innerHTML = "<input type='text' id='1'></input>";
                tr.appendChild(td);
            }
            else if (j == 1 && i == 0) {
                td.innerHTML = "Uteži";
                tr.appendChild(td);
            }
            else if (j == 1 && i != 0) {
                td.innerHTML = "<input type='number' id='2' class='test'></input>";
                tr.appendChild(td);
            }
        }
    }
    document.getElementById("tabela").appendChild(tabela);

}


function dodajAlternativo() {

    let table = document.getElementById('tabela1'),
        i;

    for (i = 0; i < table.rows.length; i++) {
        if (i == 0) {
            createCell(table.rows[i].insertCell(table.rows[i].cells.length), i);
        } else {
            createCell(table.rows[i].insertCell(table.rows[i].cells.length), i);
        }
    }

}

function appendRow() {
    var tbl = document.getElementById('tabela1'),
        row = tbl.insertRow(tbl.rows.length),
        i;
    for (i = 0; i < tbl.rows[0].cells.length; i++) {
        if (i == 0) {
            createCell(row.insertCell(i), 0);
        } else {
            createCell(row.insertCell(i), 1);
        }

    }
}

function createCell(cell, i) {
    if (i == 0) {
        cell.innerHTML = "<input type='text'" + "id='" + id + "'" + "></input>";
        id++;
    } else {
        cell.innerHTML = "<input type='number'" + "id='" + id + "'" + "></input>";
        id++;
    }
}
 

function izracunaj() {
    array = [];
    poljaAlternativ = [];
    stVrstic = -1;

    let table = document.getElementById("tabela1");
    for (let i = 0, row; row = table.rows[i]; i++) {
        stVrstic++;
        for (let j = 0, col; col = row.cells[j]; j++) {
            if (i == 0 && j < 2) {

            } else if (i == 0 && j >= 2) {
                let x = col.firstChild.value;
                poljaAlternativ.push(x);
            } else {
                let x = col.firstChild.value;
                array.push(x);
            }

        }
    }



    narediPolja();
}

function narediPolja() {
    poljaParametri = [];
    poljaUtezi = [];
    poljeVrednosti = [];
    let stevec = 0;
    let stevec1 = 1;
    let stevec2 = 0;
    let stevec3 = 1;

    let st = poljaAlternativ.length + 2;

    for (let i = 0; i < stVrstic; i++) {
        poljaParametri.push(array[stevec]);
        stevec = stevec + st;
    }

    for (let i = 0; i < stVrstic; i++) {
        poljaUtezi.push(array[stevec1]);
        stevec1 = stevec1 + st;
    }

    for (let i = 0; i < array.length; i++) {
        if (i == stevec2) {
            stevec2 = stevec2 + st;

        } else if (i == stevec3) {
            stevec3 = stevec3 + st;
        } else {
            poljeVrednosti.push(array[i]);

        }
    }

    urediPolja();

}

function urediPolja() {

    poljeObjekti = [];
    let velikostPolja = poljaParametri.length;
    let poljeVrednosti1 = [];
    let st = poljaAlternativ.length;



    for (let i = 0; i < poljaAlternativ.length; i++) {
        let stevilo = i;

        for (let j = 0; j < velikostPolja; j++) {
            poljeVrednosti1.push(poljeVrednosti[stevilo])
            stevilo = stevilo + st;
        }

        let obj = {
            alternativa: poljaAlternativ[i],
            parametri: poljaParametri,
            utezi: poljaUtezi,
            vrednosti: poljeVrednosti1,
            skupnaVrednost: 0
        };
        poljeObjekti.push(obj);
        poljeVrednosti1 = [];
    }


    izracunajVrednosti();
}

function izracunajVrednosti() {

    poljeObjekti.forEach(obj => {
        let c = 0;
        for (let i = 0; i < obj.utezi.length; i++) {
            let a = obj.utezi[i];
            let b = obj.vrednosti[i];
            c = c + (a * b);
        }
        obj.skupnaVrednost = c;

    });


    prikaziNajboljso();
}

function prikaziNajboljso() {

    document.getElementById("prikaz").innerHTML = "";


    let list = document.createElement("ol");
    let id = 0;

    poljeObjekti.sort((a, b) => { return b.skupnaVrednost - a.skupnaVrednost });

    poljeObjekti.forEach(obj => {
        let li = document.createElement("li");
        li.innerHTML = "Alternativa " + obj.alternativa + " ima vrednost:  " + obj.skupnaVrednost;
        if (id == 0) {
            li.setAttribute("Style", "background-color: #00ff00;");
        } else if (id == 1) {
            li.setAttribute("Style", "background-color: #ffff99;");
        }
        id++;

        list.appendChild(li);
    });
    document.getElementById("prikaz").appendChild(list);

    prikaziTortiDiagram();
    prikazDiagram();
    narediGumbe();
}
 

function prikaziTortiDiagram() {

    let data = [];

    for (let i = 0; i < poljaParametri.length; i++) {
        let dp = {
            y: poljeObjekti[0].utezi[i],
            label: poljeObjekti[0].parametri[i]
        }

        data.push(dp);
    }

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        title: {
            text: "Vpliv parametrov"
        },
        data: [{
            type: "pie",
            startAngle: 240,
            yValueFormatString: "##0.00\"\"",
            indexLabel: "{label}",
            dataPoints: data
        }]
    });
    chart.render();

}

function prikazDiagram() {

    let data1 = [];

    for (let i = 0; i < poljeObjekti.length; i++) {
        let dp = {
            y: poljeObjekti[i].skupnaVrednost,
            label: poljeObjekti[i].alternativa
        }

        data1.push(dp);
    }

    var chart = new CanvasJS.Chart("chartContainer1", {
        animationEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        title: {
            text: "Vrednosti alternativ"
        },
        axisY: {
            title: "Vrednosti"
        },
        data: [{
            type: "column",
            showInLegend: true,
            legendMarkerColor: "grey",
            legendText: "Alternative",
            dataPoints: data1
        }]
    });
    chart.render();
}



function narediGumbe() {

    document.getElementById("gumbi").innerHTML = "";

    for (let i = 0; i < poljaParametri.length; i++) {
        let gumb = document.createElement("button");
        let text = poljaParametri[i];
        gumb.innerHTML = text;
        gumb.setAttribute("id", i);
        gumb.setAttribute("onclick", "analizaObcutljivosti(" + i + ")");
        document.getElementById("gumbi").appendChild(gumb);

    }


}


function analizaObcutljivosti(id) {

    let data = [];
    let colors = [
        
        "red",
        "blue",        
        "green",
        "black",
        "purple",
        "yellow",
    ]

    let barva = 0;

    poljeObjekti.forEach(obj => {

        let dp = [];
        let utezi = obj.utezi;
        let vrednosti = obj.vrednosti;
        let a = 0;
        let b = 0;
        let c = 0;
    
        for (let j = 1; j <= 10; j++) {
            c = 0;
            let rezultat = 0;
            let d = vrednosti[id] * j;
            rezultat = rezultat + d;

            for (let i = 0; i < obj.vrednosti.length; i++) {

                if (i == id) {

                } else {
                    a = utezi[i];
                    b = vrednosti[i];
                    c = c + (a * b);
                }
            }
            rezultat = rezultat + c;

            let dps = { x: j, y: rezultat }
            dp.push(dps);
        }

        let nekaj = {
            type: "line",
            showInLegend: true,
            name: obj.alternativa,
            markerType: "square",
            xValueFormatString: "",
            color: colors[barva],
            dataPoints: dp
        }

        data.push(nekaj)
        barva++;


    });



    var chart = new CanvasJS.Chart("chartContainer2", {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "Analiza občutljivosti za " + poljaParametri[id]
        },
        axisX: {
            valueFormatString: "",
            crosshair: {
                enabled: true,
                snapToDataPoint: true
            }
        },
        axisY: {
            title: "Vrednost",
            includeZero: true,
            crosshair: {
                enabled: true
            }
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "bottom",
            horizontalAlign: "left",
            dockInsidePlotArea: true,
            itemclick: toogleDataSeries
        },
        data: data
    });
    chart.render();

    function toogleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }

}
