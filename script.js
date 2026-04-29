alert("JS working");
const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const slots = ["7:30-8:25","8:25-9:20","9:20-10:15","BREAK","10:45-11:40","11:40-12:35","12:35-1:30"];

const subjects = [
    {name:"DS", teacher:"Mam A"},
    {name:"SFAI", teacher:"Mam B"},
    {name:"COA", teacher:"Mam C"},
    {name:"OS", teacher:"Mam D"},
    {name:"SE", teacher:"Mam E"}
];

function shuffle(arr){
    return arr.sort(()=>Math.random()-0.5);
}

// GENERATE ONE BRANCH
function generateBranch(teacherMap){

    let table = "<table><tr><th>Day</th>";
    slots.forEach(s => table += `<th>${s}</th>`);
    table += "</tr>";

    for(let d of days){

        table += `<tr><td>${d}</td>`;

        let daySubjects = shuffle([...subjects]);

        // RANDOM FREE SLOT (except BREAK)
        let validIndexes = [0,1,2,4,5,6];
        let freeIndex = validIndexes[Math.floor(Math.random()*validIndexes.length)];

        for(let i=0;i<slots.length;i++){

            if(slots[i] === "BREAK"){
                table += `<td class="break">BREAK</td>`;
                continue;
            }

            if(i === freeIndex){
                table += `<td class="free">FREE</td>`;
                continue;
            }

            let sub = daySubjects[i % daySubjects.length];
            let key = d + "-" + i;

            // prevent clash while generating (soft check)
            if(teacherMap[key] && teacherMap[key] === sub.teacher){
                sub = daySubjects[(i+1) % daySubjects.length];
            }

            teacherMap[key] = sub.teacher;

            table += `<td>${sub.name}<br>(${sub.teacher})</td>`;
        }

        table += "</tr>";
    }

    table += "</table>";
    return table;
}

// MAIN GENERATE
function generateTimetable(){

    document.getElementById("alertBox").innerHTML = "";

    let teacherMap = {};

    let aids = generateBranch(teacherMap);
    let aiml = generateBranch(teacherMap);
    let cseds = generateBranch(teacherMap);

    document.getElementById("aids").innerHTML = aids;
    document.getElementById("aiml").innerHTML = aiml;
    document.getElementById("cseds").innerHTML = cseds;
}

// CHECK CLASH BUTTON
function checkClashes(){

    let teacherMap = {};
    let clashFound = false;

    let tables = ["aids","aiml","cseds"];

    for(let t of tables){

        let table = document.getElementById(t).getElementsByTagName("table")[0];
        if(!table) continue;

        for(let r=1; r<table.rows.length; r++){
            for(let c=1; c<table.rows[r].cells.length; c++){

                let cell = table.rows[r].cells[c].innerText;

                if(cell.includes("BREAK") || cell.includes("FREE")) continue;

                let teacher = cell.split("(")[1]?.replace(")","");

                let key = r + "-" + c;

                if(teacherMap[key] && teacherMap[key] === teacher){
                    clashFound = true;
                } else {
                    teacherMap[key] = teacher;
                }
            }
        }
    }

    if(clashFound){
        document.getElementById("alertBox").innerHTML =
            "<div class='alert'>❌ Clash Detected!</div>";
    } else {
        document.getElementById("alertBox").innerHTML =
            "<div style='color:green;font-weight:bold;'>✅ No Clash Found</div>";
    }
}