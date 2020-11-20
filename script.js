function create(el, classNames, child, parent, ...dataAttr) {
    let element = null;
    try {
        element = document.createElement(el);
    } catch (error) {
        throw new Error('Unable to create HTMLElement! Give a proper tag name');
    }
    if (classNames) element.classList.add(...classNames.split(' ')); // "class1 class2 class3"
    if (child && Array.isArray(child)) {
        child.forEach((childElement) => childElement && element.appendChild(childElement));
    } else if (child && typeof child === 'object') {
        element.appendChild(child);
    } else if (child && typeof child === 'string') {
        element.innerHTML = child;
    }
    if (parent) {
        parent.appendChild(element);
    }
if (dataAttr.length) {
    dataAttr.forEach(([attrName, attrValue]) => {
        if (attrValue === "") {
            element.setAttribute(attrName, "");
        }
        if (attrName.match(/type|id|value|for|name|selected|draggable/)) {
        element.setAttribute(attrName, attrValue);
        } else {
            element.dataset[attrName] = attrValue;
        }
    });
}
    return element;
}
const wrap = create('div','wrap')
const main = create('main', '',wrap)
//made a Cell 
class Cell {
constructor(number){
    this.number = number;
    if(number!=" "){
        this.cellContainer = create('div', 'gem-puzzle_item', this.number, null, ['number',this.number]);
        this.cellContainer.addEventListener('click',()=>{
            this.clickCell()})
    }else{
        this.cellContainer = create('div', 'gem-puzzle_item gem-puzzle_item__empty', this.number, null, ['number'," "]);
    }
};   
clickCell=()=>{
    this.cellContainer.classList.add("clicked");
}
}
//made a Gem
class Gem{
constructor(){
    this.data= {
        winGemArr:[],
        nearEmptyCellCoord:[],
        emptyCellCoord:{i: 3, j: 3},
        int:0,
        gemArr: [],
        timer: 0,
        turns: 0,
        int: null,
        win: false,
        highscores: [],
    };
    this.properties= {
        size: 4,
        sound: false,
        difficulty: 2,
        style:  "text",
        image: '/assets/images/0.png'//исправить или убрать 
    }
}
init(){
    document.body.prepend(main);
    return this;
}
generateWinGemArr(){
    let size  = this.properties.size
    let winGemArr  = this.data.winGemArr
    for(let i=0; i<size; i++){
        let newArr=[];
        winGemArr.push(newArr)
        for(let j=1; j<=size; j++){
            winGemArr[i].push((j+i*size).toString());
        }
    }
    winGemArr[size-1][size-1] =" ";//заменяю последний кубик на пустой div
}
generateGemArr(){
    //добавила чисто чтобы вызывалось сразу
    this.generateWinGemArr()
    if(localStorage.getItem('gemArr')){
        this.data.gemArr=JSON.parse(localStorage.getItem('gemArr'))
    }else{
        let size  = this.properties.size
        let gemArr  = this.data.gemArr
        for(let i=0; i<size; i++){
            let newArr=[];
            gemArr.push(newArr)
            for(let j=1; j<=size; j++){
                gemArr[i].push((j+i*size).toString());
            }
        }
        gemArr[size-1][size-1] =" ";//заменяю последний кубик на пустой div
    let difficulty = Math.floor(size*size/this.properties.difficulty)
while(difficulty>0) {
        this.mixGemArr()
        difficulty = difficulty-1
       }

//находим пустую ячейку
this.findEmptyCell()
//находим все ячейки, которые рядом с пустой ячейкой
this.findNearEmptyCell()
    }
}
mixGemArr(){
    //находим пустую ячейку
    this.findEmptyCell()
    //находим все ячейки, которые рядом с пустой ячейкой
    this.findNearEmptyCell()
    let nearEmptyCell=this.data.nearEmptyCellCoord
    let emptyCell = this.data.emptyCellCoord
    let changetCell =Math.floor(Math.random() * (nearEmptyCell.length))
    this.data.gemArr[emptyCell.i][emptyCell.j]=this.data.gemArr[nearEmptyCell[changetCell].i][nearEmptyCell[changetCell].j]
    this.data.gemArr[nearEmptyCell[changetCell].i][nearEmptyCell[changetCell].j]=" ";
}
generateLayout(){
    let header = create("aside", "aside", null,wrap,['name','size'])
                // generate audio elements
                const audio = document.createDocumentFragment();
                const soundPath = "audio/";
                let  sounds  = [{ file: "turn.wav", name: "turn" }, { file: "win.wav", name: "win" }]
                sounds.forEach((item) => {
                const audioElement = document.createElement("audio");
                audioElement.setAttribute("src", soundPath + item.file);
                audioElement.setAttribute("data-key", item.name);
                audio.appendChild(audioElement);
                });
        create('div',null,audio,header)
        create('div','size_container aside_item',[
            create('h2',"title_secondary","Выберите размер поля"),
            create('select',"size_list",[
            create('option', null, "3x3", null,["value","3"]),
            create('option', null, "4x4", null,["value","4"],['selected', "selected"]),
            create('option', null, "5x5", null,["value","5"]),
            create('option', null, "6x6", null,["value","6"]),
            create('option', null, "7x7", null,["value","7"]),
            create('option', null, "8x8", null,["value","8"]),
        ])],header)
        create('div','difficult_container aside_item',[
            create('h2',"title_secondary","Выберите уровень сложности"),
            create('select',"difficult_list",[
                create('option', null, "простой", null,["value","3"]),
                create('option', null, "средний", null,["value","1"],['selected', "selected"]),
                create('option', null, "сложный", null,["value","0.1"]),
        ])],header)
        create('div','difficult_container aside_item',[
            create('h2',"title_secondary","Картинка или цифры?"),
            create('select',"style_list",[
                create('option', null, "картинка", null,["value","image"]),
                create('option', null, "цифры", null,["value","text"],['selected', "selected"]),
        ])],header)
        create("div",'aside_item button_container',[
            create('h2','title_secondary','Начать новую игру'),
            create('button','button__prime button_refresh','start')
        ],header)
        create('div','aside_item',[
            create('h2','title_secondary', 'Время игры'),
            create('div','timer','00:00')
        ],header)
        create('div','aside_item',[
            create('h2','title_secondary', 'Количество ходов'),
            create('div', 'counter', `${this.data.turns}`)
        ],header)
        create("div",'aside_item button_container',[
            create('h2','title_secondary','Сделать паулзу'),
            create('button','button__prime button_save','pause & save')
        ],header)
    document.querySelector('.size_list').addEventListener('change',()=>{
        this.properties.size=document.querySelector('.size_list').value
        this.refreshLayout();
        this.stopTimer();
        this.findEmptyCell()
        this.findNearEmptyCell()
        this.removeDradAttrForCell()
        this.addDradAttrForCell()
    })
    //реакция на изменение значения выбранного селектора уровня сложности
    document.querySelector('.difficult_list').addEventListener('change',()=>{
        this.properties.difficulty=document.querySelector('.difficult_list').value
        this.refreshLayout();
        this.stopTimer();
        this.findEmptyCell()
        this.findNearEmptyCell()
        this.removeDradAttrForCell()
        this.addDradAttrForCell()
    })
    document.querySelector('.button_refresh').addEventListener('click',()=>{
        this.refreshLayout();
        this.stopTimer();
        this.findEmptyCell()
        this.findNearEmptyCell()
        this.removeDradAttrForCell()
        this.addDradAttrForCell()
    })
    document.querySelector('.button_save').addEventListener('click',()=>{
        this.saveGame();
    })
    document.querySelector('.style_list').addEventListener('change',()=>{
        this.refreshLayout();
        this.stopTimer();
        this.findEmptyCell()
        this.findNearEmptyCell()
        this.removeDradAttrForCell()
        this.addDradAttrForCell()
        this.properties.style=document.querySelector('.style_list').value
        this.generateGemCells()
    })
    this.generateGemArr()
    let gemPuzzle_container = create("div", "gem-puzzle_container", null,wrap )
    this.gemPuzzle_primeSection = create('section', 'gem-puzzle_prime-section',null,gemPuzzle_container)

    //сохраняться при перезагрузке экрана
        if(localStorage.getItem('gemArr')){
            document.querySelector(".gem-puzzle_container").prepend(
                create("div","message_container restarSavedtGame","Продолжить сохраненную игру?"))
            this.data.timer = localStorage.getItem('timer');
            this.data.turns = localStorage.getItem('turns');
            document.querySelector('.counter').innerHTML=this.data.turns
            this.getTimer()
            document.querySelector(".button_save").classList.add('button__prime__disabled')
            document.querySelector('.message_container').addEventListener("click",()=>{
                this.restarSavedtGame()
            })
            if (localStorage.getItem('size')) {
                this.properties.size = localStorage.getItem('size');
            }
            if (localStorage.getItem('difficulty')) {
                this.properties.difficulty = localStorage.getItem('difficulty');
            }
            if (localStorage.getItem('style')) {
                this.properties.style = localStorage.getItem('style');
            }
            document.querySelector(`.style_list>option[value="${this.properties.style}"]`).setAttribute("selected","selected")
            document.querySelector(`.difficult_list>option[value="${this.properties.difficulty}"]`).setAttribute("selected","selected")
            document.querySelector(`.size_list>option[value="${this.properties.size}"]`).setAttribute("selected","selected")
        }
            this.generateGemCells()
            const gemPuzzle_primeSection = document.querySelector(`.gem-puzzle_prime-section`);
            this.dragAndDropCell()    
            this.addDradAttrForCell()
        document.querySelector(".gem-puzzle_prime-section").addEventListener('click',()=>this.swipeCell())
        
        }
getTimer(){
    let time = new Date(2020, 0, 1, 0, 0, this.data.timer)
    let min = time.getMinutes() < 10 ? "0" + time.getMinutes().toString() : time.getMinutes()
    let sec = time.getSeconds() < 10 ? "0" + time.getSeconds().toString() : time.getSeconds()
    document.querySelector(".timer").innerHTML=` ${min}:${sec}`   
}
startTimer(){
    this.data.int = setInterval(() =>{
    this.data.timer++
    this.getTimer()  }, 1000);}

stopTimer(){
    clearInterval(this.data.int);
    this.data.timer = 0;
}
generateGemCells(){
    document.querySelector('.gem-puzzle_prime-section').style["grid-template-columns"] = `repeat(${this.properties.size}, 1fr)`
    document.querySelector('.gem-puzzle_prime-section').style["grid-template-rows"] = `repeat(${this.properties.size}, 1fr)`
    let gemPuzzle_primeSection = document.querySelector(".gem-puzzle_prime-section")
    gemPuzzle_primeSection.innerHTML="";
    let {size}=this.properties
        let imgArr = [];
        if (this.properties.style == 'image') {
        for (let a = 0; a < size; a++) {
            imgArr.push([]);
        }
        let k = 1;
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
            imgArr[i][j] = k;
            k++;
            }
        }
        imgArr[size - 1][size - 1] = 0;
        }
    this.data.gemArr.flat().forEach((number)=>{
        let cell = null;
        if (this.properties.style == "text") {
            cell = new Cell(number);
            cell.cellContainer.style = ""
            }else  {
            cell = new Cell(number);
            if (number>0){
                cell.cellContainer.style.color = "rgba(255,255,255,.2)";
                cell.cellContainer.style.background = "url('img/01.jpg')";
                cell.cellContainer.style.border= "none";
                cell.cellContainer.innerHTML=""
                cell.cellContainer.style.backgroundSize = document.querySelector('.gem-puzzle_container').offsetWidth + "px";
                let origPos = this.getPos(number, imgArr);
                let offset = document.querySelector('.gem-puzzle_container').offsetWidth / size;
                cell.cellContainer.style.backgroundPosition = `${-1 * origPos.j * offset}px ${-1 * origPos.i * offset}px`;
            }
            }
        gemPuzzle_primeSection.appendChild(cell.cellContainer);
    })
}
getPos(number, array = []) {
    let arr = [];
    if (array.length > 0) {
        arr = array;
    } else {
        arr = this.data.gemArr;
    }
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] == number) {
                return { i, j };
            }
        }
    }
}
swipeCell(){
    //определяем координаты пустой ячейки
    this.findEmptyCell()
    let {size}=this.properties
    let items = document.querySelectorAll(".gem-puzzle_item")
    let checkedCellCoord ={}; //координаты выбранной ячейки
//определяем координаты выбранной ячейки
    items.forEach(elem=>{
        if(elem.classList.contains('clicked')){
            for(let i=0; i<this.data.gemArr.length; i++){
                for(let j=0; j<this.properties.size; j++){
                    if ( this.data.gemArr[i][j] == elem.dataset.number ) {
                        checkedCellCoord={i, j}
                    }
                }
            }
        }
    })
    if(( Object.keys(checkedCellCoord).length===0)){
        return
    }
    let nearCellCoord=[];//координаты рядомстоящих клеточек
    if(checkedCellCoord.j!=0){
        nearCellCoord.push({i:(checkedCellCoord.i),j:(checkedCellCoord.j-1)});
    }        
    if(checkedCellCoord.i!=0){
        nearCellCoord.push({i:(checkedCellCoord.i-1),j:(checkedCellCoord.j)});
    }
    if(checkedCellCoord.i!=(size-1)){
        nearCellCoord.push({i:(checkedCellCoord.i+1),j:(checkedCellCoord.j)});
    }
    if(checkedCellCoord.j!=(size-1)){
        nearCellCoord.push({i:(checkedCellCoord.i),j:(checkedCellCoord.j+1)});
    }
let movingCellCoord={}
for(let i=0; i<nearCellCoord.length; i++){
    if((nearCellCoord[i].i== this.data.emptyCellCoord.i)&&(nearCellCoord[i].j== this.data.emptyCellCoord.j)){
        movingCellCoord =checkedCellCoord;
        document.querySelector(".gem-puzzle_item__empty").classList.add("empty__afterClick")
    }
}
//пытаюсь перезаписать gemArr
if(Object.keys(movingCellCoord).length!==0){
    this.data.gemArr[this.data.emptyCellCoord.i][this.data.emptyCellCoord.j]=document.querySelector(".clicked").dataset.number
    this.data.gemArr[movingCellCoord.i][movingCellCoord.j]=" ";
    this.generateGemCells()
    this.data.turns++
    document.querySelector(".counter").textContent=this.data.turns;
    if(this.data.turns==1){this.startTimer()}
    this.playSound("turn")
    this.checkWinGame()
    this.findEmptyCell()
    this.findNearEmptyCell()
    if(this.data.turns!=0){
        this.removeDradAttrForCell()
        this.addDradAttrForCell()}
}else{
document.querySelector(".clicked").classList.remove("clicked")
}


}
addDradAttrForCell(){
    let nearEmptyCellCoord = this.data.nearEmptyCellCoord
    for(let m=0; m<nearEmptyCellCoord.length; m++){
        document.querySelector(`.gem-puzzle_item[data-number="${this.data.gemArr[nearEmptyCellCoord[m].i][nearEmptyCellCoord[m].j]}"]`).setAttribute('draggable',"true")
    }
}
removeDradAttrForCell(){
    document.querySelectorAll(".gem-puzzle_item").forEach(element => {
        element.removeAttribute('draggable')
    });
    
}
dragAndDropCell(){
    this.findEmptyCell()
    this.findNearEmptyCell()
//drag&drop
    //родительский элемент
    const gemPuzzle_primeSection = document.querySelector(`.gem-puzzle_prime-section`);
    //элемент клеточки
    const sellItem = gemPuzzle_primeSection.querySelectorAll(`.gem-puzzle_item`);
//добавляем класс на событие dragstart
//удаляем класс
gemPuzzle_primeSection.addEventListener(`dragstart`, (evt) => {
    setTimeout(() => {
        evt.target.classList.add(`gem-puzzle_item__selected`);
    }, 0);
})
gemPuzzle_primeSection.addEventListener(`dragend`, (evt) => {
            evt.target.classList.remove(`hidden`);
            evt.target.classList.remove(`gem-puzzle_item__selected`);
    this.generateGemCells()
    this.data.turns++
    document.querySelector(".counter").textContent=this.data.turns;
    if(this.data.turns==1){this.startTimer()}
    this.findEmptyCell()
    this.findNearEmptyCell()
    this.removeDradAttrForCell()
    this.addDradAttrForCell()
    this.checkWinGame()
    this.playSound("turn")
});

gemPuzzle_primeSection.addEventListener(`dragenter`, (evt) => {
    //удаляем все предварительные "события"
        evt.preventDefault();
        //перетаскиваемый элемент
        const activeElement = gemPuzzle_primeSection.querySelector(`.gem-puzzle_item__selected`);
        //currentElement - сначала это тот, который тащишь, но в какой-то момент он меняется на тот, "на который" ты тащишь
        const currentElement = evt.target;
        //проверяем, можно ли этот эл-т двигать
        let isMoveable = activeElement !== currentElement && currentElement.classList.contains(`gem-puzzle_item__empty`) && activeElement.dataset.number!=" ";
        let activeCellCoord = {}
        for(let i=0; i<this.data.gemArr.length; i++){
            for(let j=0; j<this.properties.size; j++){
                if ( this.data.gemArr[i][j] == document.querySelector(".gem-puzzle_item__selected").dataset.number) {
                    activeCellCoord={i, j}
                }
            }
        }
        if (isMoveable  && this.data.gemArr[this.data.emptyCellCoord.i][this.data.emptyCellCoord.j]==" ") {
            this.data.gemArr[this.data.emptyCellCoord.i][this.data.emptyCellCoord.j]=activeElement.dataset.number
            this.data.gemArr[activeCellCoord.i][activeCellCoord.j]=" "
        }
    });
}
playSound(name) {
    const audio = document.querySelector(`audio[data-key="${name}"]`);
    audio.currentTime = 0;
    audio.play();
    }
findEmptyCell(){
    let emptyCellCoord =this.data.emptyCellCoord; //координаты пустой ячейки
    for(let i=0; i<this.data.gemArr.length; i++){
        for(let j=0; j<this.properties.size; j++){
            if ( this.data.gemArr[i][j] == " ") {
                emptyCellCoord={i, j}
            }
        }
    }
    this.data.emptyCellCoord = emptyCellCoord;
}
findNearEmptyCell(){
    let {size}=this.properties
    this.data.nearEmptyCellCoord=[];
    let emptyCellCoord =this.data.emptyCellCoord; //координаты пустой ячейки
    let nearEmptyCellCoord=this.data.nearEmptyCellCoord;//координаты рядомстоящих с пустой ячейкой клеточек
    if(emptyCellCoord.j!=0){
        nearEmptyCellCoord.push({i:(emptyCellCoord.i),j:(emptyCellCoord.j-1)});
    }        
    if(emptyCellCoord.i!=0){
        nearEmptyCellCoord.push({i:(emptyCellCoord.i-1),j:(emptyCellCoord.j)});
    }
    if(emptyCellCoord.i!=(size-1)){
        nearEmptyCellCoord.push({i:(emptyCellCoord.i+1),j:(emptyCellCoord.j)});
    }
    if(emptyCellCoord.j!=(size-1)){
        nearEmptyCellCoord.push({i:(emptyCellCoord.i),j:(emptyCellCoord.j+1)});
    }
    this.data.nearEmptyCellCoord=nearEmptyCellCoord

    //document.querySelector(`.mousedowned`).dataset.number
}
refreshLayout(){
    localStorage.removeItem('gemArr');
    localStorage.removeItem('turns');
    localStorage.removeItem('timer');;
    this.data.gemArr =[];
    this.data.winGemArr =[];
    this.generateGemArr()
    this.generateGemCells()
    if(document.querySelector(".message_container")!=null){
        document.querySelector(".message_container").remove()
    }
    if(document.querySelector(".button__prime__disabled")!=null){
        document.querySelector(".button__prime__disabled").removeAttribute("disabled")
        document.querySelector(".button__prime__disabled").classList.remove("button__prime__disabled")
    }
    this.data.timer = 0;
    this.data.turns = 0;
    document.querySelector(".timer").textContent="00:00";
    document.querySelector(".counter").textContent="0";
}
saveGame(){
    localStorage.setItem('gemArr', JSON.stringify(this.data.gemArr));
    localStorage.setItem('turns', parseInt(this.data.turns));
    localStorage.setItem('timer', parseInt(this.data.timer));
    localStorage.setItem('size', parseInt(this.properties.size));
    localStorage.setItem('difficulty', this.properties.difficulty.toString());
    localStorage.setItem('style', this.properties.style);
    this.stopTimer()
    this.data.timer = localStorage.getItem('timer');
    this.data.turns = localStorage.getItem('turns');
    document.querySelector(".gem-puzzle_container").prepend(
        create("div","message_container restarSavedtGame","Продолжить сохраненную игру?"))
    document.querySelector('.message_container').addEventListener("click",()=>{
        this.restarSavedtGame()
    })
    document.querySelector(".button_save").setAttribute('disabled','disabled')
    document.querySelector(".button_save").classList.add('button__prime__disabled')
}
restarSavedtGame(){
    document.querySelector(".message_container").remove()
    if(document.querySelector(".button__prime__disabled")!=null){
        document.querySelector(".button__prime__disabled").removeAttribute("disabled")
        document.querySelector(".button__prime__disabled").classList.remove("button__prime__disabled")
    }
    this.startTimer()
}
checkWinGame(){
    let gemArr=this.data.gemArr.flat();
    let winGemArr = this.data.winGemArr.flat();
    let win = this.data.win
    for(let i=0; i<gemArr.length; i++){
        if(gemArr[i]!=winGemArr[i]){
            return
        }else{
            win=(gemArr[i]==winGemArr[i])
        }
    }
    if(win!=false){
        this.winGame()
    }
}
winGame(){
    this.playSound("win")
    this.data.win = true;
    this.stopTimer();
    let winTime = document.querySelector(".timer").innerHTML
    document.querySelector(".gem-puzzle_container").prepend(
        create("div","message_container winGame",[
            create('h2','title__secondary', 'Ура, вы победили!'),
            create('div',null,`Количество ходов: ${this.data.turns}`),
            create('div', null, `Время игры: ${winTime} сек.`),
            create('div', "winGame_startNewGameMessage", `Сыграем еще раз?`)
        ]))
    document.querySelector(".button_save").setAttribute('disabled','disabled')
    document.querySelector(".button_save").classList.add('button__prime__disabled')
    document.querySelector('.message_container').addEventListener("click",()=>{
        this.refreshLayout()
    })
}
}
new Gem().init().generateLayout()

