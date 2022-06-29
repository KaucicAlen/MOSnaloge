let id = 0;

function narediDrevo() {

    let ul = document.getElementById("drevo");

    let li = document.createElement("li");

    li.innerHTML = '<ul id="ulId' + id + '">' + '<input type="text" name="name" class="classId' + id + '" placeholder="Vnesi ime"><button ' + 'onclick="dodajDrevo(' + id + ')"' + '>+</button><button onclick="izbrisi(' + id + ')">-</button>' + '</ul>';
    li.setAttribute("id", "idLista" + id)

    ul.appendChild(li)

    id++;
}



function dodajDrevo(idLista) {
    let ul = document.getElementById("ulId" + idLista);
    let li = document.createElement("li");
    li.setAttribute("id", "idLista" + id)

    li.innerHTML = '<ul id="ulId' + id + '">' + '<input type="text" name="name" class="classId' + id + '" placeholder="Vnesi ime"><button ' + 'onclick="dodajDrevo(' + id + ')"' + '>+</button><button onclick="izbrisi(' + id + ')">-</button>' + '</ul>';

    id++;

    ul.appendChild(li)



}

function izbrisi(idlista) {
    let li = document.getElementById("idLista" + idlista);
    let ul = li.parentElement;

    ul.removeChild(li);
}




let drevo = [];




function preberiPodatke(id) {

    let root2 = document.getElementById("ulId" + id);

    for (let i = 3; i < root2.childElementCount; i++) {
        let vrednost = root2.children[i].firstChild.firstChild;
        let stOtrok = root2.children[i].firstChild.childElementCount;

        drevo.push(vrednost.value);

        if (stOtrok > 3) {
            let newArray = [];

            for (let j = 3; j < stOtrok; j++) {
                let element = root2.children[i].firstChild.children[j].firstChild;
                let idHere = element.id.replace(/^\D+/g, '');
                let vrednost = element.firstChild.value;
                newArray.push(vrednost);
                preberiPodatke(idHere);
            }
            drevo.push(newArray);
        }
    }
}

let arrayVsehPrimerkov = [];


function preberiArray(array) {
    let arrayPrimerkov = [];

    for (let i = 0; i < array.length; i++) {
        if (Array.isArray(array[i]) == false) {
            arrayPrimerkov.push(array[i])
        } else {
            preberiArray(array[i]);
        }
    }
    arrayVsehPrimerkov.push(arrayPrimerkov)

}

function klik() {
    drevo = [];
    arrayVsehPrimerkov = [];
    let root = document.getElementById("ulId0");
    let imeDrevesa = root.firstChild.value;

    console.log(imeDrevesa);

    preberiPodatke(0);
    preberiArray(drevo);
    narediTabele();


}

let cellId = 0;

function narediTabele() {

    let divTable = document.getElementById("tabela");
    divTable.innerHTML = "";
    let tableId = 0;

    for (let k = 0; k < arrayVsehPrimerkov.length; k++) {
        let button = document.createElement("button");
        button.setAttribute("onclick", "izracunajutezi(" + tableId + ")")
        button.innerHTML = "Iračunaj uteži"

        let table = document.createElement("table");
        table.setAttribute("style", "width: 100px; border: 2px solid black; border-collapse: collapse");
        table.setAttribute("id", tableId);
        tableId++;
        let array = arrayVsehPrimerkov[k];
        let b = 0;
        let a = 0;
        for (let i = 0; i < array.length + 1; i++) {

            let tr = table.insertRow();
            for (let j = 0; j < array.length + 1; j++) {

                let td = tr.insertCell();
                td.setAttribute("style", "width: 100px; border: 2px solid black;")
                td.setAttribute("id", "cellId" + cellId)

                let input = document.createElement("input");
                input.setAttribute("type", "number");
                input.setAttribute("placeholder", "Vnesi Stevilo")

                if (i == 0 && j == 0) {
                    td.innerHTML = ("");
                } else if (i == 0) {
                    td.innerHTML = array[a]
                    a++
                } else if (j == 0) {
                    td.innerHTML = array[b];
                    b++
                } else if (j == i && i == j) {
                    td.innerHTML = 1
                } else {
                    td.appendChild(input)
                }
                cellId++;
            }
        }
        //table.setAttribute("id", id);
        divTable.appendChild(table);
        divTable.appendChild(button);

    }
}

function izracunajutezi(id) {

    let table = document.getElementById(id);
    let imena = [];
    let stevilke = [];
    let rezultati = [];
    let rezultat = 1;

    //iterate trough rows
    for (var i = 0, row; row = table.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
            if (i != 0) {
                if (col.innerHTML === '<input type="number" placeholder="Vnesi Stevilo">') {
                    stevilke.push(col.firstChild.value * 1);
                } else {
                    if (isNaN(col.innerHTML) == true) {
                        imena.push(col.innerHTML)
                    } else {
                        stevilke.push(col.innerHTML * 1);
                    }
                }
            }

        }
    }
    console.log(imena);
    console.log(stevilke);
    let dolzina = imena.length;
    let novoPolje = [];
    let priorityVectorArray = [];

    for (let i = 0; i < stevilke.length; i++) {
        novoPolje.push(stevilke[i])
        if (novoPolje.length == dolzina) {
            for (let j = 0; j < novoPolje.length; j++) {
                rezultat *= novoPolje[j];
            }
            let powerOf = (Math.pow(rezultat, 1 / dolzina)).toFixed(3);
            rezultati.push(powerOf * 1);
            rezultat = 1;
            novoPolje = [];
        }
    }

    //console.log(rezultati)

    let utez = 0;

    for (let i = 0; i < rezultati.length; i++) {
        utez = utez + rezultati[i];
    }

    for (let i = 0; i < rezultati.length; i++) {
        let pV = (rezultati[i] / utez).toFixed(4) * 1;
        priorityVectorArray.push(pV);
    }

    //console.log(priorityVectorArray);
    najdiNajboljse(sumPv(arrayPoStolpcih(dolzina, stevilke), priorityVectorArray), id, imena);
}

function arrayPoStolpcih(dolzina, array) {
    let arrayPoStolpcih = [];
    let k = 0;
    let x = 1;
    let poljePristevanja = [];
    let vmesnoPolje = [];
    let rezultat = 0;

    for (let i = 0; i < array.length; i++) {
        arrayPoStolpcih.push(array[k]);
        k = k + dolzina;
        if (array[k] == undefined) {
            k = 0;
            k = k + x;
            x++;
        }

    }


    for (let i = 0; i < arrayPoStolpcih.length; i++) {
        vmesnoPolje.push(arrayPoStolpcih[i]);
        if (vmesnoPolje.length == dolzina) {
            for (let j = 0; j < vmesnoPolje.length; j++) {
                rezultat = rezultat + vmesnoPolje[j];
            }
            poljePristevanja.push(rezultat)
            vmesnoPolje = [];
            rezultat = 0;
        }
    }


    return poljePristevanja;

}

function sumPv(poljePristevanja, vectorArray) {

    let finalArray = []

    for (let i = 0; i < vectorArray.length; i++) {
        let a = poljePristevanja[i];
        let b = vectorArray[i];
        let c = a * b;
        finalArray.push(c.toFixed(3) * 1);
    }


    return finalArray;
}

function najdiNajboljse(array, id, poljeImen) {

    let imena = poljeImen;
    let neSortiranArray = [];
    let sortiranArray = [];
    let index = 0;
    let topIme = "";

    for(let i = 0; i < array.length; i++){
        sortiranArray.push(array[i]);
        neSortiranArray.push(array[i])
    }
    

    sortiranArray.sort((a, b) => {
        return b - a
    });

    let najbolsi = sortiranArray[0];

    neSortiranArray.forEach(element => {
        if(element === najbolsi){
            topIme = imena[index];
        }else{
            index++;
            console.log("Test")
            console.log(index);
        }
    });

    let table = document.getElementById(id);
    let p = document.createElement("p");
    p.innerHTML = "Najboljsi: " + topIme + " vrednost: " + sortiranArray[0];

    table.appendChild(p);
}




