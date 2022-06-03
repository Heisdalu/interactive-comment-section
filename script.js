"use strict"

const wrapper_Container = document.querySelector(".wrapper")
const comment_Container = document.querySelector(".comment__container")
const comment_Card = document.querySelector(".comment__card")
const reply__btn = document.querySelector(".reply__btn")
// const input_comment = document.querySelector(".input_comment")
const modal = document.querySelector(".modal")

async function ree() {
  const data = await fetch("./data.json")
  const response = data.json()
  return response
}

ree()
  .then((el) => {
    const { comments, currentUser } = el
    const local_data = localStorage.getItem("data")

    wrapper_Container.addEventListener("click", (e) => {
      display__reply_btn(e.target)
      user_comment(e.target, el)
      user_reply(e.target, el)
      voting__poll(e.target)
      edit_comment(e.target)
      update_comment(e.target)
      delete__modal(e.target)
      delete__operation(e.target)
    })

    if (local_data) {
      // check if the data is present in the local storage to prevent over-writing the previous stored data
      update_UI()
      append_comment_box()
    } else {
      // data is not present in the local storage so we store the initial data on the local storage
      localStorage.setItem("data", JSON.stringify(el))
      // comments.forEach((item) => individual__comment(item))
      append_comment(el)
      append_reply(el)
      append_comment_box()
    }
  })
  .catch((err) => {
    console.log(err)
  })

function append_reply(data) {
  // the removal of the existing element is done on line removable__elements variable where removing the arilcle card and inserting a new one and with a new reply box section

  const current_Username = data.currentUser.username
  const reply_elem = document.querySelectorAll(".reply__box")
  const replies_Arr = data.comments.map((el) => el.replies)

  reply_elem.forEach((reply_section, i) => {
    if (replies_Arr[i].length === 0) return
    // replies array with no reply
    else {
      replies_Arr[i].forEach((el) => {
        reply_section.insertAdjacentHTML(
          "beforeend",
          el.user.username === current_Username
            ? my_reply(el)
            : indivdual__reply(el)
        )
      })
    }
  })
}

function accessLocal_Storage() {
  return JSON.parse(localStorage.getItem("data"))
}

function append_comment(data) {
  data.comments.forEach((el) => {
    comment_Container.insertAdjacentHTML(
      "beforeend",
      el.commentMade_by_User ? my__comment(el) : individual__comment(el)
    )
  })
}

function update_UI() {
  const removable__elements = document.querySelectorAll(".comment__card")
  const data_parse = accessLocal_Storage()

  // if removable__elements variable are present  in the dom, we remove them
  if (removable__elements.length > 0)
    removable__elements.forEach((item) => item.remove())

  data_parse.comments.forEach((item) => {
    individual__comment(item)
  })

  append_comment(data_parse)
  // append the replies to the dom
  append_reply(data_parse)
  // update their time respectively for each comment made.

  const elements = document.querySelectorAll(".comment__card")
  const local_data = JSON.parse(localStorage.getItem("data"))
  elements.forEach((el, i) => {
    setInterval(() => {
      el.firstElementChild.querySelector("#time").textContent = timer(
        local_data.comments[i].createdAt
      )
    }, 1000)
  })

  // update their time respectively for each reply made.
  const reply_elements = document.querySelectorAll(".individual__reply")
  // places all replies array into a single array
  const dates = local_data.comments.flatMap((el) => el.replies)
  reply_elements.forEach((item) => {
    const [selected_obj] = dates.filter((el) => el.id === (+item.id || item.id))
    setInterval(() => {
      item.querySelector("#reply--time").textContent = timer(
        selected_obj.createdAt
      )
    }, 1000)
  })
}

function append_comment_box() {
  const html = `
    <section class="input__comment_box">
        <figure class="user_profile_pic">
          <img src="./images/avatars/image-juliusomo.webp" alt="" />
        </figure>
        <textarea
          name=""
          id=""
          cols="30"
          rows="10"
          class="input_comment"
          placeholder="Add a comment"
          va
        ></textarea>
        <button class="send_btn">SEND</button>
      </section>

  `

  wrapper_Container.insertAdjacentHTML("beforeend", html)
}

function indivdual__reply(data) {
  const html = `
 <section class="individual__card individual__reply" id='${data.id}'>
              <header class="coment__header">
                <figure class="comment__username_avi">
                  <img
                    src="${data.user.image.webp}"
                    alt="${data.user.username} avi"
                  />
                </figure>

                <p class="comment__username">${data.user.username}</p>
                <p class="date__posted"><time id='reply--time'>${data.createdAt}</time></p>
              </header>
              <section class="comment__box">
                <span class="mention__username">@${data.replyingTo}</span> ${data.content}
              </section>

              <section class="voting__poll">
                <figure class="upvote__btn">
                   <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path class="upvote_img" d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
                </figure>
                <span class="voting__score"> ${data.score} </span>
                <figure class="downvote_btn">
                 <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path class="downvote_svg" d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
                </figure>
              </section>

              <button class="reply__btn">
                <img src="./images/icon-reply.svg" alt="Reply button" /> Reply
              </button>
            </section>

            <section class="reply__disabled reply__option">
              <figure class="reply__option_pic"><img src="./images/avatars/image-juliusomo.webp" alt=""></figure>
              <!-- <input type="text" class="reply__option_input" placeholder="Reply" value=''> -->
              <textarea name="" id="" cols="5" rows="3" class="reply__option_input"></textarea>
              <button class="reply__option_btn">Reply</button>
            </section>
 `

  return html
}

function my_reply(data) {
  const html = `
 <section class="individual__card individual__reply current__user_reply" id='${
   data.id
 }'>
              <header class="coment__header">
                <figure class="comment__username_avi">
                  <img
                    src="${data.user.image.webp}"
                    alt="${data.user.username} avi"
                  />
                </figure>

                <p class="comment__username">${data.user.username}</p>
                <p class="date__posted"><time id='reply--time'>${
                  data.reply_made_by_user ? "" : data.createdAt
                }</time></p>
              </header>
              <section class="comment__box" contenteditable="false">
                <span class="mention__username" contenteditable="false">@${
                  data.replyingTo
                }</span> ${data.content}
              </section>

              <section class="voting__poll">
                <figure class="upvote__btn">
                   <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path class="upvote_img" d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
                </figure>
                <span class="voting__score"> ${data.score} </span>
                <figure class="downvote_btn">
                   <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path class="downvote_svg" d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
                </figure>
              </section>

              <div class="button_box">
                <button class="delete__btn"><img src="./images/icon-delete.svg" alt="delete button">Delete</button>
                <button class="edit__btn"><img src="./images/icon-edit.svg" alt="edit button">Edit</button>
              </div>

              <button class="update__btn update__disabled">Update</button>
            </section>
 `
  return html
}

function individual__comment(data) {
  const html = `
 <article class="comment__card ${
   data.commentMade_by_User ? "personal_comment" : ""
 }" id="${data.id}">
          <section class="individual__card starter__comment" id="${data.id}">
            <header class="coment__header">
              <figure class="comment__username_avi">
                <img
                  src="${data.user.image.webp}"
                  alt=""
                />
              </figure>

              <p class="comment__username">${data.user.username}</p>
              <p class="date__posted"><time id='time'>${
                data.commentMade_by_User ? "" : data.createdAt
              }</time></p>
            </header>
            <section class="comment__box">${data.content}</section>

            <section class="voting__poll">
              <figure class="upvote__btn">
                 <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path class="upvote_img" d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
              </figure>
              <span class="voting__score">${data.score}</span>
              <figure class="downvote_btn">
                <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path class="downvote_svg" d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
              </figure>
            </section>

            <button class="reply__btn">
              <img src="./images/icon-reply.svg" alt="" /> Reply
            </button>

          </section>

          <section class="reply__disabled reply__option">
              <figure class="reply__option_pic"><img src="./images/avatars/image-juliusomo.webp" alt=""></figure>
              <!-- <input type="text" class="reply__option_input" placeholder="Reply" value=''> -->
              <textarea name="" id="" cols="5" rows="3" class="reply__option_input"></textarea>
              <button class="reply__option_btn">Reply</button>
            </section>

          <section class="reply__box">
         
          </section>
          
        </article>
 `

  return html
}
function my__comment(data) {
  const html = `
 <article class="comment__card ${
   data.commentMade_by_User ? "personal_comment" : ""
 }" id="${data.id}">
          <section class="individual__card starter__comment" id="${data.id}">
            <header class="coment__header">
              <figure class="comment__username_avi">
                <img
                  src="${data.user.image.webp}"
                  alt=""
                />
              </figure>

              <p class="comment__username">${data.user.username}</p>
              <p class="date__posted"><time id='time'>${
                data.commentMade_by_User ? "" : data.createdAt
              }</time></p>
            </header>
            <section class="comment__box" contenteditable="false">${
              data.content
            }</section>

            <section class="voting__poll">
              <figure class="upvote__btn">
                 <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg"><path class="upvote_img" d="M6.33 10.896c.137 0 .255-.05.354-.149.1-.1.149-.217.149-.354V7.004h3.315c.136 0 .254-.05.354-.149.099-.1.148-.217.148-.354V5.272a.483.483 0 0 0-.148-.354.483.483 0 0 0-.354-.149H6.833V1.4a.483.483 0 0 0-.149-.354.483.483 0 0 0-.354-.149H4.915a.483.483 0 0 0-.354.149c-.1.1-.149.217-.149.354v3.37H1.08a.483.483 0 0 0-.354.15c-.1.099-.149.217-.149.353v1.23c0 .136.05.254.149.353.1.1.217.149.354.149h3.333v3.39c0 .136.05.254.15.353.098.1.216.149.353.149H6.33Z" fill="#C5C6EF"/></svg>
              </figure>
              <span class="voting__score">${data.score}</span>
              <figure class="downvote_btn">
               <svg width="11" height="3" xmlns="http://www.w3.org/2000/svg"><path class="downvote_svg" d="M9.256 2.66c.204 0 .38-.056.53-.167.148-.11.222-.243.222-.396V.722c0-.152-.074-.284-.223-.395a.859.859 0 0 0-.53-.167H.76a.859.859 0 0 0-.53.167C.083.437.009.57.009.722v1.375c0 .153.074.285.223.396a.859.859 0 0 0 .53.167h8.495Z" fill="#C5C6EF"/></svg>
              </figure>
            </section>

           <div class="button_box">
                <button class="delete__btn"><img src="./images/icon-delete.svg" alt="delete button">Delete</button>
                <button class="edit__btn"><img src="./images/icon-edit.svg" alt="edit button">Edit</button>
              </div>

              <button class="update__btn update__disabled">Update</button>

          </section>

         
         
          </section>
          
        </article>
 `
  return html
}

function reply_box() {
  const html = `
   <section class="reply__option">
              <figure class="reply__option_pic"><img src="./images/avatars/image-juliusomo.webp" alt=""></figure>
              <!-- <input type="text" class="reply__option_input" placeholder="Reply" value=''> -->
              <textarea name="" id="" cols="5" rows="3" class="reply__option_input"class="reply__option_input"></textarea>
              <button class="reply__option_btn">Reply</button>
            </section>
  `
  return html
}

function display__reply_btn(target) {
  const clicked = target.closest(".reply__btn")
  if (!clicked) return

  // get either the starter comment box or the individual reply comment box
  const elem =
    clicked.closest(".starter__comment") ||
    clicked.closest(".individual__reply")

  // check if the reply textarea is presemt or absent
  const reply_section = elem.nextElementSibling

  // //reset all reply text area

  const replying_to_user_name =
    elem.querySelector(".comment__username").textContent
  reply_section.querySelector(
    ".reply__option_input"
  ).value = `@${replying_to_user_name} `

  reply_section.classList.toggle("reply__disabled")
}

function generate_ID() {
  const str = Math.trunc(Math.random() * 3000)
  const num = `${+new Date()}`
  return "p" + Number.parseInt(str + num)
}

function new__comment(data) {
  const input_comment = document.querySelector(".input_comment")

  const obj = {
    content: `${input_comment.value}`,
    createdAt: +new Date(),
    time: new Date(),
    id: generate_ID(),
    score: 0,
    commentMade_by_User: true,
    replies: [],
    user: {
      username: data.currentUser.username,
      image: {
        webp: data.currentUser.image.webp,
      },
    },
  }

  return obj
}

function appendTime(data) {
  const comment_Made = document.querySelector("#" + data.id)
  setInterval(() => {
    comment_Made.querySelector("#time").textContent = timer(data.createdAt)
  }, 1000)
}

function user_comment(event, data) {
  const input_comment_Box = document.querySelector(".input_comment")

  if (!event.classList.contains("send_btn")) return
  if (input_comment_Box.value === "") return /*validatiing empty box*/

  // Update Local storage
  const user_Data = new__comment(data)

  const getData = accessLocal_Storage()
  getData.comments.push(user_Data)
  localStorage.setItem("data", JSON.stringify(getData))

  document
    .querySelector(".comment__container")
    .insertAdjacentHTML("beforeend", my__comment(user_Data))

  // append time
  appendTime(user_Data)

  input_comment_Box.value = ""
}

function timer(data__Created) {
  const date = new Date();
  const time = +new Date()
  const datePosted = data__Created
  const datePosted_in_Millesecond = +data__Created

  if (Number.isFinite(datePosted_in_Millesecond)) {
    const sec = (time - datePosted_in_Millesecond) / 1000
    const day = parseInt(sec / (24 * 60 * 60))
    const hr = parseInt(sec / (60 * 60))
    const min = parseInt(sec / 60)
    const real_sec = parseInt(sec % 60)

    const week = parseInt(day / 7)

    if (real_sec <= 59 && min < 1) return `${real_sec}s`
    if (min <= 59 && hr <= 0) return `${min}m`
    if (hr > 0 && day <= 0) return `${hr}h`
    if (day > 0 && day <= 6) return `${day}d ago`
    if (week === 1) return `${week} week ago`
    if (week <= 3) return `${week} weeks ago`
    return (
      `${date.getDate()}`.padStart(2, 0) +
      "/" +
      `${date.getMonth()}` +
      "/" +
      date.getFullYear()
    )
  } else {
    return data__Created
  }
}

function new_reply(reply, replying_To_username, data) {
  const obj = {
    score: 0,
    content: reply.replace(`@${replying_To_username}`, ""), // remove the usernname from the content
    createdAt: +new Date(),
    reply_made_by_user: true,
    time: new Date(),
    id: generate_ID(),
    replyingTo: replying_To_username,
    user: {
      username: data.currentUser.username,
      image: {
        webp: data.currentUser.image.webp,
      },
    },
  }

  return obj
}

function append_replies_time(data) {
  const replies_made = document.querySelector(`#${data.id}`)
  setInterval(() => {
    replies_made.querySelector("#reply--time").textContent = timer(
      data.createdAt
    )
  }, 1000)
}

function user_reply(event, data) {
  if (!event.classList.contains("reply__option_btn")) return

  const user_id = +event.parentElement.parentElement.id
  const root_Elem_id = +event.parentElement.parentElement.parentElement.id
  const user_name =
    event.parentElement.parentElement.querySelector(
      ".comment__username"
    ).textContent //username is the name of the ownner comment, the user will reply to

  const reply__textarea = event.previousElementSibling

  if (reply__textarea.value === "") return

  const local_storage_data = accessLocal_Storage()
  const object = new_reply(reply__textarea.value, user_name, data)

  // to check if the reply was from a starter comment or indiviidual reply because a starter comment have a replies array to apppend new replies but the indiviudal reply does not have replies array so on the inddividual comment, we traverse to the starter comment and append to the replies array

  // updating the replies array
  const [filtered_Arr] = local_storage_data.comments.filter(
    (el) => el.id === (user_id || root_Elem_id)
  )

  filtered_Arr.replies.push(object)

  // we locate the index of the filtered array that was present in teh local storage and replace /re-assigned them with updated filtered array
  const index = local_storage_data.comments.indexOf(filtered_Arr)
  local_storage_data.comments[index] = filtered_Arr

  localStorage.setItem("data", JSON.stringify(local_storage_data))

  const reply__box =
    event.parentElement.parentElement.querySelector(".reply__box") ||
    event.parentElement.parentElement.parentElement.querySelector(".reply__box")

  reply__box.insertAdjacentHTML("beforeend", my_reply(object))

  append_replies_time(object)
  event.closest(".reply__option").classList.toggle("reply__disabled") // hide reply section
}

function update_Voting_poll(selected__Arr, event, clicked) {
  const current_Score_Elem = clicked.querySelector(".voting__score")

  if (event.closest(".upvote__btn")) {
    selected__Arr.score += 1
    current_Score_Elem.textContent = selected__Arr.score
  }

  if (event.closest(".downvote_btn") && selected__Arr.score > 0) {
    // reset at 0;
    selected__Arr.score -= 1
    current_Score_Elem.textContent = selected__Arr.score
  }
}

function update_comment_Arr(local_storage_data, elem_id) {
  // update the comment the array by replacing the previous object with the new object due to changes done.
  const [filtered__comment_data] = local_storage_data.comments.filter(
    (el) => el.id === (+elem_id || elem_id)
  )

  const index = local_storage_data.comments.indexOf(filtered__comment_data)
  local_storage_data.comments[index] = filtered__comment_data

  localStorage.setItem("data", JSON.stringify(local_storage_data))
}

function update_replies_Arr(local_storage_data, reply_elem, elem) {
  //update replies array

  const [filtered_comment] = local_storage_data.comments.filter(
    (el) => el.id === (+elem || elem)
  )
  const [filtered_reply] = filtered_comment.replies.filter(
    (el) => el.id === (+reply_elem || reply_elem)
  )

  // update the replies array
  const index1 = filtered_comment.replies.indexOf(filtered_reply)

  filtered_comment.replies[index1] = filtered_reply

  // update the comment array
  const index2 = local_storage_data.comments.indexOf(filtered_comment)
  local_storage_data.comments[index2] = filtered_comment

  localStorage.setItem("data", JSON.stringify(local_storage_data))
}

function voting__poll(event) {
  const clicked = event.closest(".voting__poll")
  if (!clicked) return

  const local_data = accessLocal_Storage()
  const parentElem_id = event.closest(".starter__comment")?.id
  const replyElem = event.closest(".individual__reply")?.id

  const [filtered_comment] = local_data.comments.filter(
    (el) => el.id === (+parentElem_id || parentElem_id)
  )

  if (event.closest(".starter__comment")) {
    // console.log(filtered_comment);
    update_Voting_poll(filtered_comment, event, clicked)
    // update UI
    update_comment_Arr(local_data, parentElem_id)
  }

  if (event.closest(".individual__reply")) {
    const rootElem_id = event.closest(".comment__card").id
    const [filtered_reply_comment] = local_data.comments.filter(
      (el) => el.id === (+rootElem_id || rootElem_id)
    )
    const [reply] = filtered_reply_comment.replies.filter(
      (el) => el.id === (+replyElem || replyElem)
    )

    update_Voting_poll(reply, event, clicked) // perform calculation

    update_replies_Arr(local_data, replyElem, rootElem_id)
  }
}

function edit_comment(event) {
  const edit__button = event.closest(".edit__btn")
  if (!edit__button) return

  const elem =
    event.closest(".starter__comment") || event.closest(".individual__reply")

  let comment_box = elem.querySelector(".comment__box")

  elem.querySelector(".update__btn").classList.remove("update__disabled")
  edit__button.classList.add("edit__disabled")
  comment_box.classList.add("comment_box--focus")
  comment_box.contentEditable = true
  edit__button.disabled = true
  comment_box.focus()
  // comment_box.querySelector(".mention__username").contentEditable = false;

  if (elem.classList.contains("individual__reply")) {
    elem.querySelector(".mention__username").contentEditable = false
  }
}

function update_comment(event) {
  const clicked = event.closest(".update__btn")
  if (!clicked) return

  const root_Elem =
    event.closest(".starter__comment") || event.closest(".individual__reply")
  const comment_box = root_Elem.querySelector(".comment__box")

  const comment_username =
    root_Elem.querySelector(".mention__username")?.textContent ||
    root_Elem.querySelector(".comment__username").textContent
  const comment__content = comment_box.textContent
    .replace(comment_username, "")
    .trim()

  if (comment__content === "") return
  root_Elem
    .querySelector(".comment__box")
    .classList.remove("comment_box--focus")
  clicked.classList.add("update__disabled")
  root_Elem.querySelector(".edit__btn").classList.remove("edit__disabled")
  root_Elem.querySelector(".comment__box").contentEditable = false
  root_Elem.querySelector(".edit__btn").disabled = false

  const local_data = accessLocal_Storage()

  if (root_Elem.classList.contains("starter__comment")) {
    const [filtered_data] = local_data.comments.filter(
      (el) => el.id === (+root_Elem.id || root_Elem.id)
    )
    filtered_data.content = `${comment__content}`
    update_comment_Arr(local_data, root_Elem.id)
  }

  if (root_Elem.classList.contains("individual__reply")) {
    const root__Elem_card = root_Elem.closest(".comment__card").id

    const [filtered_comment_data] = local_data.comments.filter(
      (el) => el.id === (+root__Elem_card || root__Elem_card)
    )
    const [filtered_replies_data] = filtered_comment_data.replies.filter(
      (el) => el.id === (+root_Elem.id || root_Elem.id)
    )

    filtered_replies_data.content = `${comment__content}`

    // update the replies option then update the comment array
    update_replies_Arr(local_data, root_Elem.id, root__Elem_card)
  }
}

let delete_User_Arr = []

function delete__operation(event) {
  const clicked =
    event.closest(".proceed_to_delete") || event.closest(".cancel")
  if (!clicked) return

  const local_data = accessLocal_Storage()

  if (event.classList.contains("proceed_to_delete")) {
    const [selected__elem] = delete_User_Arr

    if (selected__elem.classList.contains("starter__comment")) {
      const selected__comment = local_data.comments.filter(
        (item) => item.id !== (+selected__elem.id || selected__elem.id)
      )
      // update the following
      local_data.comments = selected__comment
      selected__elem.closest(".comment__card").remove()
      localStorage.setItem("data", JSON.stringify(local_data))
    } else if (selected__elem.classList.contains("individual__reply")) {
      const selected__rootElement = selected__elem.closest(".comment__card")

      const [selected_parent_elem] = local_data.comments.filter(
        (el) =>
          el.id === (+selected__rootElement.id || selected__rootElement.id)
      )

      const selected__reply = selected_parent_elem.replies.filter(
        (el) => el.id !== (+selected__elem.id || selected__elem.id)
      )
      //update the following
      selected_parent_elem.replies = selected__reply
      update_comment_Arr(local_data, selected__rootElement.id)
      selected__elem.remove()
    }
  }

  modal.classList.toggle("modal--disabled")
  delete_User_Arr = []
}

function delete__modal(event) {
  if (!event.closest(".delete__btn")) return

  const elem =
    event.closest(".starter__comment") || event.closest(".individual__reply")

  delete_User_Arr.push(elem)
  modal.classList.toggle("modal--disabled")
}

// localStorage.clear('data');
