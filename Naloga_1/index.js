let dejanja = [];
let stevilaNeugodno = [];
let stevilaUgodno = [];
let stevila = [];
let savage = [];



function Upload() {
    var fileUpload = document.getElementById("fileUpload");
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.onload = function (e) {
                var table = document.createElement("table");
                table.setAttribute("id", "tabela1");
                var rows = e.target.result.split("\n");
                for (var i = 0; i < rows.length; i++) {
                    var cells = rows[i].split(",");
                    if (cells.length > 1) {
                        var row = table.insertRow(-1);
                        for (var j = 0; j < cells.length; j++) {
                            var cell = row.insertCell(-1);
                            cell.innerHTML = cells[j];
                        }
                    }
                }
                var dvCSV = document.getElementById("dvCSV");
                dvCSV.innerHTML = "";
                dvCSV.appendChild(table);
            }
            reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }

}

function GetCellValues() {
    dejanja = [];
    stevilaNeugodno = [];
    stevilaUgodno = [];
    stevila = [];
    savage = [];

    dodajDejanja();
    pesimistMetoda();
    optimistMetoda();
    laplaceMetoda();
    savageMetoda();
    hurwitzovKriterij();
    graf();
}

function dodajDejanja() {

    let table = document.getElementById("tabela1");

    n = table.rows.length;
    m = document.getElementById("tabela1").rows[0].cells.length;

    for (var r = 0; r < n; r++) {
        for (var c = 0; c < m; c++) {
            if (r == 0 && c >= 1) {
                dejanja.push(table.rows[r].cells[c].innerHTML);
            }
        }

    }
};

function pesimistMetoda() {

    let table = document.getElementById("tabela1");


    n = table.rows.length;
    m = document.getElementById("tabela1").rows[0].cells.length;

    for (var r = 0; r < n; r++) {
        for (var c = 0; c < m; c++) {
            if (r == 1 && c >= 1) {
                stevilaNeugodno.push(table.rows[r].cells[c].innerHTML * 1);
            }
        }

    }

    let max = Math.max(...stevilaNeugodno)
    document.getElementById("pesimist").innerHTML = "Metoda pesimist izbere: " + dejanja[stevilaNeugodno.indexOf(max)] + " (" + max + ")";


}



function optimistMetoda() {
    let table = document.getElementById("tabela1");


    n = table.rows.length;
    m = document.getElementById("tabela1").rows[0].cells.length;

    for (var r = 0; r < n; r++) {
        for (var c = 0; c < m; c++) {
            if (r == 2 && c >= 1) {

                stevilaUgodno.push(table.rows[r].cells[c].innerHTML * 1);
            }
        }

    }
    const max = Math.max(...stevilaUgodno)

    document.getElementById("optimist").innerHTML = "Metoda optimist izbere: " + dejanja[stevilaUgodno.indexOf(max)] + " (" + max + ")";

};

function laplaceMetoda() {
    let a;
    let b;
    let c;

    for (let i = 0; stevilaUgodno.length > i; i++) {
        a = stevilaNeugodno[i] * 1;
        b = stevilaUgodno[i] * 1;

        c = (a + b) / 2;
        stevila.push(c);
    }

    const max = Math.max(...stevila)

    document.getElementById("laplace").innerHTML = "Metoda LaPlace izbere: " + dejanja[stevila.indexOf(max)] + " (" + max + ")";

};



function savageMetoda() {
    let maxplus = Math.max(...stevilaUgodno);
    let maxmin = Math.max(...stevilaNeugodno);
    let prvaStevila = [];
    let drugaStevila = [];
    let savageStevila = [];

    for (let i = 0; stevilaUgodno.length > i; i++) {
        if (stevilaUgodno[i] < 0) {
            prvaStevila.push(maxplus + stevilaUgodno[i]);
        } else {
            prvaStevila.push(maxplus - stevilaUgodno[i]);
        }
    }

    for (let i = 0; stevilaNeugodno.length > i; i++) {
        if (stevilaNeugodno[i] < 0) {
            drugaStevila.push(maxmin + stevilaNeugodno[i]);
        } else {
            drugaStevila.push(maxmin - stevilaNeugodno[i]);
        }


    }

    for (let i = 0; prvaStevila.length > i; i++) {
        let vecja = Math.max(prvaStevila[i], drugaStevila[i]);
        savageStevila.push(vecja);
    }

    let izbira = Math.min(...savageStevila);


    document.getElementById("savage").innerHTML = "Metoda savage izbere: " + dejanja[savageStevila.indexOf(izbira)] + " (" + izbira + ")";
}


function hurwitzovKriterij() {
    let a = 0;

    for (let j = 0; dejanja.length > j; j++) {
        for (let i = 0.0; i < 1; i += 0.1) {
            let dobljeno = (stevilaNeugodno[a] * i) + stevilaUgodno[a] * (1 - i);
        }
        a++;

    }



}



function graf() {
    let data = [];
    
    for(let i = 0; dejanja.length > i; i++){
        let dataPoints = [];
        for (let j = 0.0; j < 1; j += 0.1) {
            let dobljeno = (stevilaUgodno[i] * j) + stevilaNeugodno[i] * (1 - j);
            let dataP = { label: j.toFixed(1), y: dobljeno }
            dataPoints.push(dataP);
        }
        
        let ime = dejanja[i];
        let alternativa = {
                type: "spline",
                visible: true,
                showInLegend: true,
                yValueFormatString: "##.00",
                name: ime,
                dataPoints: dataPoints
        };
        data.push(alternativa);
    }

    
    let chart = new CanvasJS.Chart("chartContainer", {
        theme:"light2",
        animationEnabled: true,
        title:{
            text: "Hurwitzov Kriterij"
        },
        axisY :{
            title: "Vrednosti Alternativ",
            suffix: ""
        },
        toolTip: {
            shared: "true"
        },
        legend:{
            cursor:"pointer",
            itemclick : toggleDataSeries
        },
        data: data
       
    });
    
    
    chart.render();
    
    function toggleDataSeries(e) {
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible ){
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        chart.render();
    }
    
    }