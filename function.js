class Book{
    constructor(title='Unknown',author='Unknown',year='0000', read='false', url='https://media.istockphoto.com/photos/black-ornately-embossed-book-cover-picture-id172371649?k=20&m=172371649&s=612x612&w=0&h=3QKElAlHuVHAOFkCdAslow5hxo_jyiOHrXJYTRA4214='){
        this._title=title
        this._author=author
        this._year=year
        this._read=read
        this._url=url
    }
    get title(){
        return this._title;
    }
    get author(){
        return this._author;
    }
    get year(){
        return this._year;
    }
    get read(){
        return this._read;
    }
    get url(){
        return this._url
    }
    set read(val){
        this._read=val
    }
}

class BookLibrary{
    constructor(){
        this._library = []
    }
    addBook(...args){
        for (let i=0;i<args.length;i++){
            if(!this.alreadyInLibrary(arguments[i])) this._library.push(arguments[i])
        }
    }
    removeBook(rem_title){
        const book_title_arr = this.library.map(item => item.title)
        const indexPos = book_title_arr.indexOf(rem_title)
        this.library.splice(indexPos,1)
    }
    alreadyInLibrary(book){
        return (this.library.some(item => item.title==book.title && item.year==book.year)) ? true : false
    }
    load(){
        for(let i=0;i<this.library.length;i++){
            document.getElementById('books-container').innerHTML+=`
            <div class="book-wrap">
                <div class="book-general">
                    <div class="book-inner">
                        <div class="book-frontal">
                            <div class="book-front"></div>
                            <div id="read-container">
                                <button class="delete-button" value="${this.library[i].title}">Delete</button>
                            </div>
                        </div>
                        <div class="pages"></div>
                        <div class="cover"></div>
                        <div class="book-back">
                            <div class="back-content">
                                <div class="row">
                                    <h2>Title:</h2>
                                    <p>${this.library[i].title}</p>
                                </div>
                                <div class="row">
                                    <h2>Author:</h2>
                                    <p>${this.library[i].author}</p>
                                </div>
                                <div class="row">
                                    <h2>Year:</h2>
                                    <p>${this.library[i].year}</p>
                                </div>
                                <div class="row">
                                    <h2>Read:</h2>
                                    <p id="read-state" class="pos ${(this.library[i].read==='true') ? '' : 'not-visible'}">Already read</p>
                                    <p id="not-read-state" class="pos ${(this.library[i].read==='false') ? '' : 'not-visible'}">Not read yet</p>
                                    <button class="read-button" value="${this.library[i].title}">> Change read state <</button>
                                </div>
                            </div>
                            <div class="url">
                                <p>${this.library[i].url}</p>
                            </div>
                        </div>
                        <div class="side"></div>
                    </div>
                </div>
            </div>
            `
        }
        const books = document.getElementsByClassName('book-wrap')
        for (let i=0;i<books.length;i++){
            //set background cover according to the book url property
            books[i].firstElementChild.querySelector('.book-front').style.setProperty("background","linear-gradient(to right,rgba(255, 255, 255, 0.4) 0px,rgba(255, 255, 255, 0.4) 0.1vw, rgba(255, 255, 255, 0.2) 7px, rgba(255, 255, 255, 0.2) 8px, transparent 12px, transparent 16px, rgba(255, 255, 255, 0.25) 17px, transparent 22px),url('"+books[i].querySelector('.url').firstElementChild.textContent+"') no-repeat center/100%")
            books[i].firstElementChild.querySelector('.cover').style.setProperty("background","linear-gradient(to right,rgba(255, 255, 255, 0.4) 0px,rgba(255, 255, 255, 0.4) 0.1vw, rgba(255, 255, 255, 0.2) 7px, rgba(255, 255, 255, 0.2) 8px, transparent 12px, transparent 16px, rgba(255, 255, 255, 0.25) 17px, transparent 22px),url('"+books[i].querySelector('.url').firstElementChild.textContent+"') no-repeat center/100%")
            books[i].firstElementChild.querySelector('.book-back').style.setProperty("background","linear-gradient(to left,rgba(255, 255, 255, 0.4) 0px,rgba(255, 255, 255, 0.4) 0.1vw, rgba(255, 255, 255, 0.2) 7px, rgba(255, 255, 255, 0.2) 8px, transparent 12px, transparent 16px, rgba(255, 255, 255, 0.25) 17px, transparent 22px),url('"+books[i].querySelector('.url').firstElementChild.textContent+"') no-repeat center/100%")
            //flip book container on click
            books[i].onclick = () => {
                books[i].firstElementChild.classList.toggle('flip')
            }
            //management of read-state green/red labels and read-state buttons on top of books
            const lastRow = books[i].firstElementChild.firstElementChild.querySelector('.book-back .back-content').lastElementChild
            lastRow.lastElementChild.onclick = () => {
                if(this.library[i].read==='true'){
                    this.library[i].read = 'false'
                }else{
                    this.library[i].read = 'true'
                }
                setLocalStorage(stored_library)
                lastRow.querySelector('#read-state').classList.toggle('not-visible')
                lastRow.querySelector('#not-read-state').classList.toggle('not-visible')
                books[i].firstElementChild.classList.toggle('flip')
            }
        }
        const delete_button = document.getElementsByClassName('delete-button')
        for (let i=0;i<delete_button.length;i++){
            delete_button[i].onclick = () => {
                stored_library.removeBook(delete_button[i].value)
                setLocalStorage(stored_library)
                resetBooksContainer()
                books[i].firstElementChild.classList.toggle('flip')
            }
        }
    }//end of load function
    get library(){
        return this._library;
    }
}

/*----------LOCAL STORAGE---------*/
function setLocalStorage(newWebLibrary){
    window.localStorage.setItem('weblibrary',JSON.stringify(newWebLibrary))
}

function loadLocalStorage(){
    const libStored = JSON.parse(window.localStorage.getItem('weblibrary'))
    if(libStored){
        const libObj = jsonToLibrary(libStored)
        libObj.load()
        return libObj
    }else{
        const weblibrary = new BookLibrary()
        const open = new Book('Open','Andre Agassi','2010','true','https://images-na.ssl-images-amazon.com/images/I/51MnUn63xNL._SX322_BO1,204,203,200_.jpg')
        const open2 = new Book('Shoe Dog','Phil Knight','2016','false','https://images-na.ssl-images-amazon.com/images/I/41Yve2upzEL._SY291_BO1,204,203,200_QL40_FMwebp_.jpg')
        const open3 = new Book('The Great Gatsby','F. Scott Fitzgerald','1925','false','https://m.media-amazon.com/images/I/41XMaCHkrgL._SY346_.jpg')
        const open4 = new Book('The Intelligent Investor','Benjamin Graham','1949','false','https://images-na.ssl-images-amazon.com/images/I/41vQ4DGEmoL._SX325_BO1,204,203,200_.jpg')
        weblibrary.addBook(open, open2, open3, open4)
        weblibrary.load()
        setLocalStorage(weblibrary)
        return weblibrary
    }
}

function jsonToLibrary(jsonlibrary){
    const tempLibr = new BookLibrary()
    for (let i=0;i<jsonlibrary['_library'].length;i++){
        const tempTitle = jsonlibrary['_library'][i]._title
        const tempAuthor = jsonlibrary['_library'][i]._author
        const tempYear = jsonlibrary['_library'][i]._year
        const tempRead = jsonlibrary['_library'][i]._read
        const tempUrl = jsonlibrary['_library'][i]._url
        const tempBook = new Book(tempTitle, tempAuthor, tempYear, tempRead, tempUrl)
        tempLibr.addBook(tempBook)
    }
    return tempLibr
}

var stored_library = loadLocalStorage()
const newBookIndex = document.getElementById('new_book')
const resetBookList = document.getElementById('reset_books')
const modal = document.getElementById('modal')
const modal_title = document.getElementById('title')
const modal_author = document.getElementById('author')
const modal_year = document.getElementById('year')
const modal_read = document.getElementById('read')
const modal_url = document.getElementById('url')
const modal_submit = document.getElementById('submit')

function resetBooksContainer(){
    document.getElementById('books-container').innerHTML = ""
    stored_library.load()
}

function modalReset(){
    modal_title.value = ""
    modal_author.value = ""
    modal_year.value = ""
    modal_url.value = ""
}

window.onclick = (e) => {
    if(e.target == modal){
        modal.style.display = 'none'
    }
}

submit.onclick = () => {
    const valid_title = (modal_title.value.length<=30 && modal_title.value.length>0)
    const valid_author = (modal_author.value.length<=30 && modal_author.value.length>0)
    const valid_year = (modal_year.value.length==4)
    if(valid_title && valid_author && valid_year && modal_read.value){
        if(!modal_url.value){
            const bookAlt = new Book(modal_title.value,modal_author.value,modal_year.value,modal_read.value)
            stored_library.addBook(bookAlt)
        }else{
            const bookAlt2 = new Book(modal_title.value,modal_author.value,modal_year.value,modal_read.value, modal_url.value)
            stored_library.addBook(bookAlt2)
        }
        setLocalStorage(stored_library)
        resetBooksContainer()
        modalReset()
        modal.style.display = 'none'
    }
}


newBookIndex.onclick = () => {
    modal.style.display = 'block';
}

resetBookList.onclick = () => {
    window.localStorage.clear()
    stored_library = loadLocalStorage()
    setLocalStorage(stored_library)
    resetBooksContainer()
}