// =======================
// SELECTOR BOX
// =======================
var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    selector.classList.toggle("selector_open");
})

// =======================
// DATE INPUT ERROR HANDLING
// =======================
document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown")
    })
})

// =======================
// SEX SELECTOR
// =======================
var sex = "m"
document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    })
})

// =======================
// UPLOAD SETUP
// =======================
var upload = document.querySelector(".upload");
var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif";

document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    })
});

upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown")
});

// =======================
// IMAGE UPLOAD to ImgBB
// =======================
imageInput.addEventListener('change', (event) => {

    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected");

    var file = imageInput.files[0];
    var data = new FormData();
    data.append("image", file);

    // ImgBB z Twoim kluczem API
    fetch("https://api.imgbb.com/1/upload?key=93ba25897fc2d947c8b38115ffa20d8b", {
        method: 'POST',
        body: data
    })
    .then(result => result.json())
    .then(response => {
        if (response.success) {
            var url = response.data.url;
            upload.classList.remove("error_shown");
            upload.setAttribute("selected", url);
            upload.classList.add("upload_loaded");
            upload.classList.remove("upload_loading");
            upload.querySelector(".upload_uploaded").src = url;
        } else {
            upload.classList.add("error_shown");
            upload.classList.remove("upload_loading");
            console.error("Błąd uploadu:", response);
        }
    })
    .catch(err => {
        upload.classList.add("error_shown");
        upload.classList.remove("upload_loading");
        console.error("Błąd fetch:", err);
    });
});

// =======================
// SUBMIT BUTTON
// =======================
document.querySelector(".go").addEventListener('click', () => {

    var empty = [];
    var params = new URLSearchParams();

    params.set("sex", sex);

    if (!upload.hasAttribute("selected")){
        empty.push(upload);
        upload.classList.add("error_shown")
    } else {
        params.set("image", upload.getAttribute("selected"));
    }

    var birthday = "";
    var dateEmpty = false;
    document.querySelectorAll(".date_input").forEach((element) => {
        birthday = birthday + "." + element.value;
        if (/^\s*$/.test(element.value)){
            dateEmpty = true;
        }
    })
    birthday = birthday.substring(1);

    if (dateEmpty){
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    } else {
        params.set("birthday", birthday)
    }

    document.querySelectorAll(".input_holder").forEach((element) => {
        var input = element.querySelector(".input");
        if (/^\s*$/.test(input.value)){
            empty.push(element);
            element.classList.add("error_shown");
        } else {
            params.set(input.id, input.value);
        }
    })

    if (empty.length != 0){
        empty[0].scrollIntoView();
    } else {
        location.href = "/id?" + params;
    }
});

// =======================
// GUIDE TOGGLE
// =======================
var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {
    guide.classList.toggle("unfolded");
});
