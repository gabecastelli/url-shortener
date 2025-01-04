function copyURL() {
    var text = document.querySelector('.form--shorten input').value;
    navigator.clipboard.writeText(text);
} 