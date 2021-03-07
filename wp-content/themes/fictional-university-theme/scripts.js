/* ===============================================================
  Mobile Menu Feature
=============================================================== */
class MobileMenu {
  constructor() {
    this.menu = document.querySelector(".site-header__menu")
    this.openButton = document.querySelector(".site-header__menu-trigger")
    this.events()
  }

  events() {
    this.openButton.addEventListener("click", () => this.openMenu())
  }

  openMenu() {
    this.openButton.classList.toggle("fa-bars")
    this.openButton.classList.toggle("fa-window-close")
    this.menu.classList.toggle("site-header__menu--active")
  }
}

new MobileMenu()

/* ===============================================================
  Hero Slider / Homepage Slideshow
=============================================================== */
class HeroSlider {
  constructor() {
    if (document.querySelector(".hero-slider")) {
      // count how many slides there are
      const dotCount = document.querySelectorAll(".hero-slider__slide").length

      // Generate the HTML for the navigation dots
      let dotHTML = ""
      for (let i = 0; i < dotCount; i++) {
        dotHTML += `<button class="slider__bullet glide__bullet" data-glide-dir="=${i}"></button>`
      }

      // Add the dots HTML to the DOM
      document.querySelector(".glide__bullets").insertAdjacentHTML("beforeend", dotHTML)

      // Actually initialize the glide / slider script
      var glide = new Glide(".hero-slider", {
        type: "carousel",
        perView: 1,
        autoplay: 3000
      })

      glide.mount()
    }
  }
}

new HeroSlider()

/* ===============================================================
  Google Map / Campus Map
=============================================================== */
class GoogleMap {
  constructor() {
    document.querySelectorAll(".acf-map").forEach(el => {
      this.new_map(el)
    })
  }

  new_map($el) {
    var $markers = $el.querySelectorAll(".marker")

    var args = {
      zoom: 16,
      center: new google.maps.LatLng(0, 0),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    var map = new google.maps.Map($el, args)
    map.markers = []
    var that = this

    // add markers
    $markers.forEach(function (x) {
      that.add_marker(x, map)
    })

    // center map
    this.center_map(map)
  } // end new_map

  add_marker($marker, map) {
    var latlng = new google.maps.LatLng($marker.getAttribute("data-lat"), $marker.getAttribute("data-lng"))

    var marker = new google.maps.Marker({
      position: latlng,
      map: map
    })

    map.markers.push(marker)

    // if marker contains HTML, add it to an infoWindow
    if ($marker.innerHTML) {
      // create info window
      var infowindow = new google.maps.InfoWindow({
        content: $marker.innerHTML
      })

      // show info window when marker is clicked
      google.maps.event.addListener(marker, "click", function () {
        infowindow.open(map, marker)
      })
    }
  } // end add_marker

  center_map(map) {
    var bounds = new google.maps.LatLngBounds()

    // loop through all markers and create bounds
    map.markers.forEach(function (marker) {
      var latlng = new google.maps.LatLng(marker.position.lat(), marker.position.lng())

      bounds.extend(latlng)
    })

    // only 1 marker?
    if (map.markers.length == 1) {
      // set center of map
      map.setCenter(bounds.getCenter())
      map.setZoom(16)
    } else {
      // fit to bounds
      map.fitBounds(bounds)
    }
  } // end center_map
}

new GoogleMap()

/* ===============================================================
  Search / Live Overlay Results
=============================================================== */
class Search {
  // 1. describe and create /  initiate our object
  constructor() {
    this.addSearchHTML()
    this.resultsDiv = document.querySelector("#search-overlay__results")
    this.openButton = document.querySelectorAll(".js-search-trigger")
    this.closeButton = document.querySelector(".search-overlay__close")
    this.searchOverlay = document.querySelector(".search-overlay")
    this.searchField = document.querySelector("#search-term")
    this.isOverlayOpen = false
    this.isSpinnerVisible = false
    this.previousValue
    this.typingTimer
    this.events()
  }

  // 2. events
  events() {
    this.openButton.forEach(el => {
      el.addEventListener("click", e => {
        e.preventDefault()
        this.openOverlay()
      })
    })

    this.closeButton.addEventListener("click", () => this.closeOverlay())
    document.addEventListener("keydown", e => this.keyPressDispatcher(e))
    this.searchField.addEventListener("keyup", () => this.typingLogic())
  }

  // 3. methods (function, action...)
  typingLogic() {
    if (this.searchField.value != this.previousValue) {
      clearTimeout(this.typingTimer)

      if (this.searchField.value) {
        if (!this.isSpinnerVisible) {
          this.resultsDiv.innerHTML = '<div class="spinner-loader"></div>'
          this.isSpinnerVisible = true
        }
        this.typingTimer = setTimeout(this.getResults.bind(this), 750)
      } else {
        this.resultsDiv.innerHTML = ""
        this.isSpinnerVisible = false
      }
    }

    this.previousValue = this.searchField.value
  }

  async getResults() {
    try {
      const response = await axios.get(universityData.root_url + "/wp-json/university/v1/search?term=" + this.searchField.value)
      const results = response.data
      this.resultsDiv.innerHTML = `
        <div class="row">
          <div class="one-third">
            <h2 class="search-overlay__section-title">General Information</h2>
            ${results.generalInfo.length ? '<ul class="link-list min-list">' : "<p>No general information matches that search.</p>"}
              ${results.generalInfo.map(item => `<li><a href="${item.permalink}">${item.title}</a> ${item.postType == "post" ? `by ${item.authorName}` : ""}</li>`).join("")}
            ${results.generalInfo.length ? "</ul>" : ""}
          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Programs</h2>
            ${results.programs.length ? '<ul class="link-list min-list">' : `<p>No programs match that search. <a href="${universityData.root_url}/programs">View all programs</a></p>`}
              ${results.programs.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join("")}
            ${results.programs.length ? "</ul>" : ""}

            <h2 class="search-overlay__section-title">Professors</h2>
            ${results.professors.length ? '<ul class="professor-cards">' : `<p>No professors match that search.</p>`}
              ${results.professors
                .map(
                  item => `
                <li class="professor-card__list-item">
                  <a class="professor-card" href="${item.permalink}">
                    <img class="professor-card__image" src="${item.image}">
                    <span class="professor-card__name">${item.title}</span>
                  </a>
                </li>
              `
                )
                .join("")}
            ${results.professors.length ? "</ul>" : ""}

          </div>
          <div class="one-third">
            <h2 class="search-overlay__section-title">Campuses</h2>
            ${results.campuses.length ? '<ul class="link-list min-list">' : `<p>No campuses match that search. <a href="${universityData.root_url}/campuses">View all campuses</a></p>`}
              ${results.campuses.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join("")}
            ${results.campuses.length ? "</ul>" : ""}

            <h2 class="search-overlay__section-title">Events</h2>
            ${results.events.length ? "" : `<p>No events match that search. <a href="${universityData.root_url}/events">View all events</a></p>`}
              ${results.events
                .map(
                  item => `
                <div class="event-summary">
                  <a class="event-summary__date t-center" href="${item.permalink}">
                    <span class="event-summary__month">${item.month}</span>
                    <span class="event-summary__day">${item.day}</span>  
                  </a>
                  <div class="event-summary__content">
                    <h5 class="event-summary__title headline headline--tiny"><a href="${item.permalink}">${item.title}</a></h5>
                    <p>${item.description} <a href="${item.permalink}" class="nu gray">Learn more</a></p>
                  </div>
                </div>
              `
                )
                .join("")}

          </div>
        </div>
      `
      this.isSpinnerVisible = false
    } catch (e) {
      console.log(e)
    }
  }

  keyPressDispatcher(e) {
    if (e.keyCode == 83 && !this.isOverlayOpen && document.activeElement.tagName != "INPUT" && document.activeElement.tagName != "TEXTAREA") {
      this.openOverlay()
    }

    if (e.keyCode == 27 && this.isOverlayOpen) {
      this.closeOverlay()
    }
  }

  openOverlay() {
    this.searchOverlay.classList.add("search-overlay--active")
    document.body.classList.add("body-no-scroll")
    this.searchField.value = ""
    setTimeout(() => this.searchField.focus(), 301)
    console.log("our open method just ran!")
    this.isOverlayOpen = true
    return false
  }

  closeOverlay() {
    this.searchOverlay.classList.remove("search-overlay--active")
    document.body.classList.remove("body-no-scroll")
    console.log("our close method just ran!")
    this.isOverlayOpen = false
  }

  addSearchHTML() {
    document.body.insertAdjacentHTML(
      "beforeend",
      `
      <div class="search-overlay">
        <div class="search-overlay__top">
          <div class="container">
            <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
            <input type="text" class="search-term" placeholder="What are you looking for?" id="search-term">
            <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
          </div>
        </div>
        
        <div class="container">
          <div id="search-overlay__results"></div>
        </div>

      </div>
    `
    )
  }
}

new Search()

/* ===============================================================
  My Notes Feature
=============================================================== */
class MyNotes {
  constructor() {
    if (document.querySelector("#my-notes")) {
      axios.defaults.headers.common["X-WP-Nonce"] = universityData.nonce
      this.myNotes = document.querySelector("#my-notes")
      this.events()
    }
  }

  events() {
    this.myNotes.addEventListener("click", e => this.clickHandler(e))
    document.querySelector(".submit-note").addEventListener("click", () => this.createNote())
  }

  clickHandler(e) {
    if (e.target.classList.contains("delete-note") || e.target.classList.contains("fa-trash-o")) this.deleteNote(e)
    if (e.target.classList.contains("edit-note") || e.target.classList.contains("fa-pencil") || e.target.classList.contains("fa-times")) this.editNote(e)
    if (e.target.classList.contains("update-note") || e.target.classList.contains("fa-arrow-right")) this.updateNote(e)
  }

  findNearestParentLi(el) {
    let thisNote = el
    while (thisNote.tagName != "LI") {
      thisNote = thisNote.parentElement
    }
    return thisNote
  }

  // Methods will go here
  editNote(e) {
    const thisNote = this.findNearestParentLi(e.target)

    if (thisNote.getAttribute("data-state") == "editable") {
      this.makeNoteReadOnly(thisNote)
    } else {
      this.makeNoteEditable(thisNote)
    }
  }

  makeNoteEditable(thisNote) {
    thisNote.querySelector(".edit-note").innerHTML = '<i class="fa fa-times" aria-hidden="true"></i> Cancel'
    thisNote.querySelector(".note-title-field").removeAttribute("readonly")
    thisNote.querySelector(".note-body-field").removeAttribute("readonly")
    thisNote.querySelector(".note-title-field").classList.add("note-active-field")
    thisNote.querySelector(".note-body-field").classList.add("note-active-field")
    thisNote.querySelector(".update-note").classList.add("update-note--visible")
    thisNote.setAttribute("data-state", "editable")
  }

  makeNoteReadOnly(thisNote) {
    thisNote.querySelector(".edit-note").innerHTML = '<i class="fa fa-pencil" aria-hidden="true"></i> Edit'
    thisNote.querySelector(".note-title-field").setAttribute("readonly", "true")
    thisNote.querySelector(".note-body-field").setAttribute("readonly", "true")
    thisNote.querySelector(".note-title-field").classList.remove("note-active-field")
    thisNote.querySelector(".note-body-field").classList.remove("note-active-field")
    thisNote.querySelector(".update-note").classList.remove("update-note--visible")
    thisNote.setAttribute("data-state", "cancel")
  }

  async deleteNote(e) {
    const thisNote = this.findNearestParentLi(e.target)

    try {
      const response = await axios.delete(universityData.root_url + "/wp-json/wp/v2/note/" + thisNote.getAttribute("data-id"))
      thisNote.style.height = `${thisNote.offsetHeight}px`
      setTimeout(function () {
        thisNote.classList.add("fade-out")
      }, 20)
      setTimeout(function () {
        thisNote.remove()
      }, 401)
      if (response.data.userNoteCount < 5) {
        document.querySelector(".note-limit-message").classList.remove("active")
      }
    } catch (e) {
      console.log("Sorry")
    }
  }

  async updateNote(e) {
    const thisNote = this.findNearestParentLi(e.target)

    var ourUpdatedPost = {
      "title": thisNote.querySelector(".note-title-field").value,
      "content": thisNote.querySelector(".note-body-field").value
    }

    try {
      const response = await axios.post(universityData.root_url + "/wp-json/wp/v2/note/" + thisNote.getAttribute("data-id"), ourUpdatedPost)
      this.makeNoteReadOnly(thisNote)
    } catch (e) {
      console.log("Sorry")
    }
  }

  async createNote() {
    var ourNewPost = {
      "title": document.querySelector(".new-note-title").value,
      "content": document.querySelector(".new-note-body").value,
      "status": "publish"
    }

    try {
      const response = await axios.post(universityData.root_url + "/wp-json/wp/v2/note/", ourNewPost)

      if (response.data != "You have reached your note limit.") {
        document.querySelector(".new-note-title").value = ""
        document.querySelector(".new-note-body").value = ""
        document.querySelector("#my-notes").insertAdjacentHTML(
          "afterbegin",
          ` <li data-id="${response.data.id}" class="fade-in-calc">
            <input readonly class="note-title-field" value="${response.data.title.raw}">
            <span class="edit-note"><i class="fa fa-pencil" aria-hidden="true"></i> Edit</span>
            <span class="delete-note"><i class="fa fa-trash-o" aria-hidden="true"></i> Delete</span>
            <textarea readonly class="note-body-field">${response.data.content.raw}</textarea>
            <span class="update-note btn btn--blue btn--small"><i class="fa fa-arrow-right" aria-hidden="true"></i> Save</span>
          </li>`
        )

        // notice in the above HTML for the new <li> I gave it a class of fade-in-calc which will make it invisible temporarily so we can count its natural height

        let finalHeight // browser needs a specific height to transition to, you can't transition to 'auto' height
        let newlyCreated = document.querySelector("#my-notes li")

        // give the browser 30 milliseconds to have the invisible element added to the DOM before moving on
        setTimeout(function () {
          finalHeight = `${newlyCreated.offsetHeight}px`
          newlyCreated.style.height = "0px"
        }, 30)

        // give the browser another 20 milliseconds to count the height of the invisible element before moving on
        setTimeout(function () {
          newlyCreated.classList.remove("fade-in-calc")
          newlyCreated.style.height = finalHeight
        }, 50)

        // wait the duration of the CSS transition before removing the hardcoded calculated height from the element so that our design is responsive once again
        setTimeout(function () {
          newlyCreated.style.removeProperty("height")
        }, 450)
      } else {
        document.querySelector(".note-limit-message").classList.add("active")
      }
    } catch (e) {
      console.error(e)
    }
  }
}

new MyNotes()

/* ===============================================================
  Like a Professor Feature
=============================================================== */
class Like {
  constructor() {
    if (document.querySelector(".like-box")) {
      axios.defaults.headers.common["X-WP-Nonce"] = universityData.nonce
      this.events()
    }
  }

  events() {
    document.querySelector(".like-box").addEventListener("click", e => this.ourClickDispatcher(e))
  }

  // methods
  ourClickDispatcher(e) {
    let currentLikeBox = e.target
    while (!currentLikeBox.classList.contains("like-box")) {
      currentLikeBox = currentLikeBox.parentElement
    }

    if (currentLikeBox.getAttribute("data-exists") == "yes") {
      this.deleteLike(currentLikeBox)
    } else {
      this.createLike(currentLikeBox)
    }
  }

  async createLike(currentLikeBox) {
    try {
      const response = await axios.post(universityData.root_url + "/wp-json/university/v1/manageLike", { "professorId": currentLikeBox.getAttribute("data-professor") })
      if (response.data != "Only logged in users can create a like.") {
        currentLikeBox.setAttribute("data-exists", "yes")
        var likeCount = parseInt(currentLikeBox.querySelector(".like-count").innerHTML, 10)
        likeCount++
        currentLikeBox.querySelector(".like-count").innerHTML = likeCount
        currentLikeBox.setAttribute("data-like", response.data)
      }
      console.log(response.data)
    } catch (e) {
      console.log("Sorry")
    }
  }

  async deleteLike(currentLikeBox) {
    try {
      const response = await axios({
        url: universityData.root_url + "/wp-json/university/v1/manageLike",
        method: 'delete',
        data: { "like": currentLikeBox.getAttribute("data-like") },
      })
      currentLikeBox.setAttribute("data-exists", "no")
      var likeCount = parseInt(currentLikeBox.querySelector(".like-count").innerHTML, 10)
      likeCount--
      currentLikeBox.querySelector(".like-count").innerHTML = likeCount
      currentLikeBox.setAttribute("data-like", "")
      console.log(response.data)
    } catch (e) {
      console.log(e)
    }
  }
}

new Like()