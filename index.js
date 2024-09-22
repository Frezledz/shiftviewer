const button = document.getElementById("file");
button.style.display="inline";
//確か配列は参照渡しになるからパフォーマンスは問題ないはず...
const determine_shift=(times,duration)=>{
    let time_id=0;
    while (((new Date).getHours()-duration[0])*60+((new Date).getMinutes()-duration[1])>times[time_id][0]*60+times[time_id][1]*1) {
        time_id++;
    }
    return time_id;

}
let timelog;
const apply_html = (times,duration,document,shift,roles)=>{
    const time_id=determine_shift(times,duration);
    if(timelog!=time_id){
        document.getElementById("audio").play();
        console.log();
    }
    timelog=time_id;
    document.getElementById("current").innerText= `現在時刻 : ${(new Date).getHours()}:${(new Date).getMinutes()}`;
    document.getElementById("time").innerText=`時間割り振り : ${times[time_id][0]}:${times[time_id][1]} - ${times[time_id][0]+duration[0]}:${times[time_id][1]+duration[1]}`;
    let text="";
    for(let i=0;i<shift[time_id].length;i++){
        text += `${roles[i]} : ${shift[time_id+1][i]}\n`;
    }
    document.getElementById("managers").innerText=text;
}

const handler = (e)=>{
    button.style.display="none";
    const file =e.target.files[0];
    const reader = new FileReader();
    let shift;
    reader.onload = () => {
        shift=reader.result;
        shift=shift.split("\r\n");
        let times=[];
        for(let i=0;i<shift.length;i++){
            shift[i] = shift[i].split(",");
            if(i!=0){
                times.push((shift[i][0]).split(":"));
                times[i-1][0] = Number(times[i-1][0]);
                times[i-1][1] = Number(times[i-1][1]);

            }
            shift[i].splice(0,1);
        }
        const roles=shift[0];
        shift.splice(0,0);
        const duration = [times[1][0]-times[0][0],times[1][1]-times[0][1]];
        apply_html(times,duration,document,shift,roles);
        setInterval(() => {
            apply_html(times,duration,document,shift,roles);
            
        }, 60000);
    } 

    reader.readAsText(file);
}

button.addEventListener('change', handler);