import { us } from './module.js'

console.log(us);

let url = 'https://tranquil-gorge-79901.herokuapp.com/users'
function react() {
    axios.get(url)
        .then(res => {
            reload(res.data.data)
            let h1 = document.querySelector('.length')
            h1.innerHTML = `Общее число сотрудников ${res.data.data.length}`
        })
}
react()
let arr_local_filter = JSON.parse(localStorage.getItem('users')) || []
let arr_pechen = JSON.parse(localStorage.getItem('upp')) || []
document.querySelector('.length2').innerHTML = `Премию получат: ${arr_pechen.length}`
function reload(arr) {
    let box_sotrud = document.querySelector('.box_sotrud')
    box_sotrud.innerHTML = ''
    for (let item of arr) {
        box_sotrud.innerHTML += ` 
     <div class="sotrudniki" data-on="${item.salarySupplement}" id="${item._id}"> 
        <div class="name"> 
           <img class="employee_img" src="${item.photo}"> 
           <p>${item.name} ${item.surname}</p> 
        </div> 
        <div class="price"> 
           <input class="price_inp" type="text" value="${item.salary + '$'}"> 
        </div> 
        <div class="checkbox"> 
           <input class="inp" type="checkbox" name="premiya"> 
        </div> 
        <div class="pechenkanddel"> 
           <img class="pechen" src="./img/pechenka.png" alt=""> 
           <img class="del" src="./img/del.png" alt=""> 
        </div> 
     </div> 
     `
        let employees_img = document.querySelectorAll('.employee_img')
        let modal = document.querySelector('.modal')
        let back = document.querySelector('.back')

        employees_img.forEach(employee_img => {
            employee_img.onclick = (e) => {
                modal.style.display = 'block'
                modal.style.display = 'flex'
                let p_name = document.querySelector('.p_name')
                let p_salary = document.querySelector('.p_salary')
                let p_prem = document.querySelector('.p_prem input')
                let image = document.querySelector('.image')

                p_name.innerHTML = `Имя: ${e.target.nextSibling.nextSibling.innerHTML}`
                p_salary.innerHTML = `Заробатная плата: ${e.target.parentNode.nextSibling.nextSibling.firstChild.nextSibling.value}`
                image.src = e.target.src
                let data = e.target.parentNode.parentNode
                if (data.getAttribute('data-on') === 'true') {
                    p_prem.checked = true
                } else {
                    p_prem.checked = false
                }
                form_edit.onsubmit = (event) => {
                    event.preventDefault()
                    console.log('asdasd');
                    let inps = document.querySelectorAll('form input')
                    inps.forEach(element => {
                        if (element.value !== '') {
                            let id = e.target.parentNode.parentNode.id
                            console.log(id);
                            submit2(id)
                            modal.style.display = 'none'
                            
                        } else { }
                    });
                }
                
                let izm = document.querySelectorAll('.izmenit')
                izm.forEach(element => {
                    element.onclick = () => {
                        let cont = document.querySelector('.cont')
                        cont.style.display = 'none'
                        console.log('asdasd');
                        let form_edit = document.forms.edit
                        form_edit.style.display = 'block'

                    }
                });
            }
            back.onclick = () => {
                modal.style.display = 'none'
            }

            let dels = document.querySelectorAll('.del')
            dels.forEach(delet => {
                delet.onclick = (e) => {
                    let id = e.target.parentNode.parentNode.id
                    axios.delete(`${url}/${id}`)
                        .then(res => {
                            if (res.status === 200 || res.status === 201) {
                                react()
                            }
                        })
                }
            });
        });

        let inp = document.querySelectorAll('.checkbox .inp')
        inp.forEach(input => {
            if (input.parentNode.parentNode.getAttribute('data-on') === 'true') {
                input.checked = 'checked'
            }
            input.onclick = (e) => {
                let id = e.target.parentNode.parentNode.id
                let array = []
                axios.get(url)
                    .then(res => {
                        array = res.data.data.filter(elem => elem._id === id)
                        for (let elem of array) {
                            elem.salarySupplement = !elem.salarySupplement
                            axios.patch(`${url}/${id}`, elem)
                                .then(res => console.log(res))
                        }
                        console.log(array);
                    })
            }
        });

        let btns = document.querySelectorAll('.btn')

        btns.forEach(btn => {
            btn.onclick = () => {
                btns.forEach(btn => {
                    btn.classList.remove('active_btn')
                });
                btn.classList.add('active_btn')
                if (btn.innerHTML === 'Получит премию') {
                    let array2 = []

                    axios.get(url)
                        .then(res => {
                            res.data.data.filter(elem => {
                                if (elem.salarySupplement) {
                                    array2.push(elem)
                                    reload(array2)
                                }
                            })
                        })
                }

                if (btn.innerHTML === 'Посмотреть всех') {
                    axios.get(url)
                        .then(res => {
                            reload(res.data.data)
                        })
                }
                if (btn.innerHTML === 'З/П больше 1000$') {
                    let salary = []
                    axios.get(url)
                        .then(res => {
                            res.data.data.filter(elem => {
                                if (+elem.salary > 1000) {
                                    salary.push(elem)
                                    reload(salary)
                                }
                            })
                        })
                }
                if (btn.innerHTML === 'На повышение') {
                    let up = JSON.parse(localStorage.getItem('upp')) || []
                    reload(up)

                }
            }
        });

    }
    let arr_local_pechen = []
    let pechens = document.querySelectorAll('.pechen')
    pechens.forEach(pechen => {
        pechen.onclick = (e) => {
            e.target.parentNode.parentNode.classList.add('active_text')
            let idcha = e.target.parentNode.parentNode.id

            let up2 = JSON.parse(localStorage.getItem('users')) || []

            for (let elem of up2) {
                if (elem._id === idcha) {
                    arr_local_pechen.push(elem)
                    localStorage.setItem('upp', JSON.stringify(arr_local_pechen))
                }
            }
        }
    });
}

let form_add = document.forms.add

form_add.onsubmit = (e) => {
    e.preventDefault()

    let inps = document.querySelectorAll('form input')
    inps.forEach(element => {
        if (element.value !== '') {
            submit()
        } else { }
        element.value = ''
    });
}

let arr_local = []

function submit() {
    let user = {}

    let fm = new FormData(form_add)

    fm.forEach((value, key) => {
        user[key] = value
    });

    arr_local.push(user)

    axios.post(url, user)
        .then(res => {
            if (res.status === 200 || res.status === 201) {
                react()
            }
        })

    react()

    axios.get(url)
        .then(res => {
            localStorage.setItem('users', JSON.stringify(res.data.data))
        })
}
let form_edit = document.forms.edit
function submit2(idi) {
    let user2 = {}

    let fm2 = new FormData(form_edit)

    fm2.forEach((value, key) => {
        user2[key] = value
    });

    arr_local.push(user2)



    axios.patch(`${url}/${idi}`, user2)
        .then(res => {
            if (res.status === 200 || res.status === 201) {
                react()
            }
        })

    react()

    axios.get(url)
        .then(res => {
            localStorage.setItem('users', JSON.stringify(res.data.data))
        })
}
axios.get(url)
    .then(res => {
        let inp_search = document.querySelector('.search_inp')
        inp_search.onkeyup = () => {
            let filtered = res.data.data.filter(item => item.name.toLowerCase().includes(inp_search.value.toLowerCase()))
            reload(filtered)
        }
    })