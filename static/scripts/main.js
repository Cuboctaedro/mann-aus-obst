
var wrap = (query, tag) => {
    document.querySelectorAll( query ).forEach( elem => {
        const div = document.createElement(tag);
        elem.parentElement.insertBefore(div, elem);
        div.appendChild(elem);
    });
};


document.querySelectorAll('.tripleimage').forEach(function(container) {
    var newDiv = document.createElement("div");
    var child2 = container.children.item(1);
    var child3 = container.children.item(2);
    container.insertBefore(newDiv, child2);
    newDiv.appendChild(child2);
    newDiv.appendChild(child3);
});