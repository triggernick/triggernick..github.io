/**
 * Precious Gallery module by Trigger Nick.
 * 
 * Commercial License.
 * 
 * Immediately-invoked function expression (IIFE) module.
 * @module preciousGallery
 * @returns {{initAll}}
 */
var preciousGallery = (function() {

/** 
 * Init galleries with a specific DOM className.
 * @param {string} className - The class of the DOM elements.
 * @memberof module:preciousGallery
 */
function initByClass(className) {
    const gallery=document.getElementsByClassName(className);

    for (let i = 0; i < gallery.length; i++) {
        initByElement(gallery[i]);
    };    
}

/**
 * init the gallery with DOM id.
 * @param {string} id - The id of the DOM element.
 * @memberof module:preciousGallery
 */
function initById(id) {
    const gallery=document.getElementById(id);

    initByElement(gallery);
}

/**
 * Init the gallery with DOM element.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function initByElement(element) {    
    const children = element.children;

    // Hide all children of the given element.
    for (let i = 0; i < children.length; i++) {
        children[i].style.display = 'none';        
    }

    // Place icons we will use in the DOM.
    if(!iconsInitialized) {
        initIcons();

        iconsInitialized=true;
    }

    // Build database.
    const data = addDatabase(element);

    // Create gallery section.
    createGallery(element, data);

    // Create ligthbox section.
    createLightbox(element, data);

    // Create loaded images event handlers.
    createImgHandler(element);

    // Place the thumbnails in the gallery.
    placeThumbnails(element);
    
    // Make the gallery visible.
    element.style.display = 'flex'; 
}

/**
 * Remove the gallery DOM element.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */ 
function deInitByElement(element) {
    // Make the gallery invisible.
    element.style.display = 'none';

    // Remove database section.
    database.splice(getData(element), 1);

    // Remove gallery DOM elements.
    const gallery = element.getElementsByClassName("pg-gallery")[0];
    gallery.remove();

    // Remove lightbox DOM elements.
    const lightbox = element.getElementsByClassName("pg-lightbox")[0];
    lightbox.remove();
}

//
//  Text strings.
//

const strAllCategory = "All";

//
//  Icons.
//

let iconsInitialized=false;  // keep track of icons initialization.

/**
 * Initialize all icons.
 * @memberof module:preciousGallery
 */
function initIcons() {
    // create a container with icons which will be appended to the document DOM.
    // The icons can then be retrieved using the getIconElement function.
    const svgSpriteContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgSpriteContainer.style.display = 'none';  // no need to display this container.
    let symbol; // an icon symbol DOM element.

    // Close icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-close');
    symbol.setAttribute('viewBox', '0 0 24 24');
    symbol.innerHTML = '<path fill-rule="evenodd" clip-rule="evenodd" d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z" />';
    
    svgSpriteContainer.appendChild(symbol);

    // Zoom in icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-zoomIn');
    symbol.setAttribute('viewBox', '0 0 24 24');
    symbol.innerHTML = '<path d="M10.035,18.069a7.981,7.981,0,0,0,3.938-1.035l3.332,3.332a2.164,2.164,0,0,0,3.061-3.061l-3.332-3.332A8.032,8.032,0,0,0,4.354,4.354a8.034,8.034,0,0,0,5.681,13.715ZM5.768,5.768A6.033,6.033,0,1,1,4,10.035,5.989,5.989,0,0,1,5.768,5.768Zm.267,4.267a1,1,0,0,1,1-1h2v-2a1,1,0,0,1,2,0v2h2a1,1,0,0,1,0,2h-2v2a1,1,0,0,1-2,0v-2h-2A1,1,0,0,1,6.035,10.035Z"/>';
    
    svgSpriteContainer.appendChild(symbol);

    // Zoom out icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-zoomOut');
    symbol.setAttribute('viewBox', '0 0 24 24');
    symbol.innerHTML = '<path d="M10.035,18.069a7.981,7.981,0,0,0,3.938-1.035l3.332,3.332a2.164,2.164,0,0,0,3.061-3.061l-3.332-3.332A8.032,8.032,0,0,0,4.354,4.354a8.034,8.034,0,0,0,5.681,13.715ZM5.768,5.768A6.033,6.033,0,1,1,4,10.035,5.989,5.989,0,0,1,5.768,5.768Zm.267,4.267a1,1,0,0,1,1-1h6a1,1,0,0,1,0,2h-6A1,1,0,0,1,6.035,10.035Z"/>';
    
    svgSpriteContainer.appendChild(symbol);

    // Left scroll icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-leftScroll');
    symbol.setAttribute('viewBox', '0 0 1024 1024');
    symbol.innerHTML = '<path d="M768 903.232l-50.432 56.768L256 512l461.568-448 50.432 56.768L364.928 512z" />';
    
    svgSpriteContainer.appendChild(symbol);

    // Right scroll icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-rightScroll');
    symbol.setAttribute('viewBox', '0 0 1024 1024');
    symbol.innerHTML = '<path d="M256 120.768L306.432 64 768 512l-461.568 448L256 903.232 659.072 512z" />';
    
    svgSpriteContainer.appendChild(symbol);

    // Fullscreen icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-fullscreen');
    symbol.setAttribute('viewBox', '0 0 24 24');
    symbol.innerHTML = '<path d="M7.69233 18.2781L9.70711 20.2929C9.9931 20.5789 10.0787 21.009 9.92388 21.3827C9.7691 21.7564 9.40446 22 9 22H3C2.44772 22 2 21.5523 2 21V15C2 14.5955 2.24364 14.2309 2.61732 14.0761C2.99099 13.9213 3.42111 14.0069 3.70711 14.2929L5.571 16.1568L9.25289 12.4749C9.64342 12.0844 10.2766 12.0844 10.6671 12.4749L11.3742 13.182C11.7647 13.5725 11.7647 14.2057 11.3742 14.5962L7.69233 18.2781Z" /><path d="M16.3077 5.72187L14.2929 3.70711C14.0069 3.42111 13.9213 2.99099 14.0761 2.61732C14.2309 2.24364 14.5955 2 15 2H21C21.5523 2 22 2.44772 22 3V9C22 9.40446 21.7564 9.7691 21.3827 9.92388C21.009 10.0787 20.5789 9.9931 20.2929 9.70711L18.429 7.84319L14.7471 11.5251C14.3566 11.9156 13.7234 11.9156 13.3329 11.5251L12.6258 10.818C12.2352 10.4275 12.2352 9.7943 12.6258 9.40378L16.3077 5.72187Z" />';
    
    svgSpriteContainer.appendChild(symbol);

    // Fullscreen exit icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-fullscreenExit');
    symbol.setAttribute('viewBox', '0 0 24 24');
    symbol.innerHTML = '<path d="M20.04 10.1109L18.0252 8.09612L21.7071 4.41421C22.0976 4.02369 22.0976 3.39052 21.7071 3L21 2.29289C20.6095 1.90237 19.9763 1.90237 19.5858 2.29289L15.9039 5.9748L14.04 4.11089C13.754 3.82489 13.3239 3.73933 12.9502 3.89411C12.5765 4.04889 12.3329 4.41353 12.3329 4.81799V10.818C12.3329 11.3703 12.7806 11.818 13.3329 11.818H19.3329C19.7373 11.818 20.102 11.5744 20.2568 11.2007C20.4115 10.827 20.326 10.3969 20.04 10.1109Z" /><path d="M3.96 13.8891L5.97478 15.9039L2.29289 19.5858C1.90237 19.9763 1.90237 20.6095 2.29289 21L3 21.7071C3.39052 22.0976 4.02369 22.0976 4.41421 21.7071L8.0961 18.0252L9.96 19.8891C10.246 20.1751 10.6761 20.2607 11.0498 20.1059C11.4235 19.9511 11.6671 19.5865 11.6671 19.182V13.182C11.6671 12.6297 11.2194 12.182 10.6671 12.182H4.66711C4.26265 12.182 3.89801 12.4256 3.74323 12.7993C3.58845 13.173 3.674 13.6031 3.96 13.8891Z" />';
    
    svgSpriteContainer.appendChild(symbol);

    // Miniatures icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-miniatureIcon');
    symbol.setAttribute('viewBox', '0 0 100 100');
    symbol.innerHTML = '<path d="M30.278,17.553L30.278,17.553H19.823v0l-0.001,0c-1.253,0-2.269,1.017-2.269,2.269c0,0,0,0,0,0h0v10.454h0 c0,1.253,1.016,2.269,2.269,2.269l0.001,0v0h10.454l0,0c1.253,0,2.269-1.016,2.269-2.269h0V19.823h0c0,0,0,0,0,0 C32.547,18.57,31.531,17.553,30.278,17.553z"/><path d="M55.227,17.553L55.227,17.553H44.773v0l-0.001,0c-1.253,0-2.269,1.017-2.269,2.269c0,0,0,0,0,0h0v10.454h0 c0,1.253,1.016,2.269,2.269,2.269l0.001,0v0h10.454l0,0c1.253,0,2.269-1.016,2.269-2.269h0V19.823h0c0,0,0,0,0,0 C57.497,18.57,56.481,17.553,55.227,17.553z"/><path d="M82.446,19.822c0-1.252-1.016-2.269-2.269-2.269l0,0H69.722v0l-0.001,0c-1.253,0-2.269,1.017-2.269,2.269l0,0.001v10.453 c0,0,0,0,0,0.001c0,1.253,1.016,2.27,2.269,2.27l0.001,0v0h10.454l0,0c1.253,0,2.269-1.016,2.269-2.269h0V19.822L82.446,19.822 C82.446,19.822,82.446,19.822,82.446,19.822z"/><path d="M30.278,42.506L30.278,42.506H19.823v0l-0.001,0c-1.253,0-2.269,1.017-2.269,2.269c0,0,0,0,0,0h0V55.23h0 c0,1.253,1.016,2.269,2.269,2.269l0.001,0v0h10.454l0,0c1.253,0,2.269-1.016,2.269-2.269h0V44.776h0c0,0,0,0,0,0 C32.547,43.523,31.531,42.506,30.278,42.506z"/><path d="M55.227,42.506L55.227,42.506H44.773v0l-0.001,0c-1.253,0-2.269,1.017-2.269,2.269c0,0,0,0,0,0h0V55.23h0 c0,1.253,1.016,2.269,2.269,2.269l0.001,0v0h10.454l0,0c1.253,0,2.269-1.016,2.269-2.269h0V44.776h0c0,0,0,0,0,0 C57.497,43.523,56.481,42.506,55.227,42.506z"/><path d="M80.177,42.506L80.177,42.506H69.722v0l-0.001,0c-1.253,0-2.269,1.017-2.269,2.269l0,0.001v10.453c0,0,0,0,0,0.001 c0,1.253,1.016,2.27,2.269,2.27l0.001,0v0h10.454l0,0c1.253,0,2.269-1.016,2.269-2.269h0V44.776h0c0,0,0,0,0,0 C82.446,43.523,81.43,42.506,80.177,42.506z"/><path d="M30.278,67.454L30.278,67.454H19.823l0,0h-0.001c-1.253,0-2.269,1.017-2.269,2.269l0,0h0v10.454h0 c0,1.253,1.016,2.269,2.269,2.269h0.001l0,0h10.454l0,0c1.253,0,2.269-1.016,2.269-2.269h0V69.723h0l0,0 C32.547,68.471,31.531,67.454,30.278,67.454z"/><path d="M55.227,67.454L55.227,67.454H44.773l0,0h-0.001c-1.253,0-2.269,1.017-2.269,2.269l0,0h0v10.454h0 c0,1.253,1.016,2.269,2.269,2.269h0.001l0,0h10.454l0,0c1.253,0,2.269-1.016,2.269-2.269h0V69.723h0l0,0 C57.497,68.471,56.481,67.454,55.227,67.454z"/><path d="M80.177,67.454L80.177,67.454H69.722l0,0h-0.001c-1.253,0-2.269,1.017-2.269,2.269l0,0v10.453l0,0.001 c0,1.253,1.016,2.27,2.269,2.27h0.001l0,0h10.454l0,0c1.253,0,2.269-1.016,2.269-2.269h0V69.723h0l0,0 C82.446,68.471,81.43,67.454,80.177,67.454z"/>';
    
    svgSpriteContainer.appendChild(symbol);

    // Download icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-download');
    symbol.setAttribute('viewBox', '0 0 24 24');
    symbol.innerHTML = '<path d="M12.5535 16.5061C12.4114 16.6615 12.2106 16.75 12 16.75C11.7894 16.75 11.5886 16.6615 11.4465 16.5061L7.44648 12.1311C7.16698 11.8254 7.18822 11.351 7.49392 11.0715C7.79963 10.792 8.27402 10.8132 8.55352 11.1189L11.25 14.0682V3C11.25 2.58579 11.5858 2.25 12 2.25C12.4142 2.25 12.75 2.58579 12.75 3V14.0682L15.4465 11.1189C15.726 10.8132 16.2004 10.792 16.5061 11.0715C16.8118 11.351 16.833 11.8254 16.5535 12.1311L12.5535 16.5061Z" /><path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" />';
    
    svgSpriteContainer.appendChild(symbol);

    // Search icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-search');
    symbol.setAttribute('viewBox', '0 0 32 32');
    symbol.innerHTML = '<path d="M16.906 20.188l5.5 5.5-2.25 2.281-5.75-5.781c-1.406 0.781-3.031 1.219-4.719 1.219-5.344 0-9.688-4.344-9.688-9.688s4.344-9.688 9.688-9.688 9.719 4.344 9.719 9.688c0 2.5-0.969 4.781-2.5 6.469zM3.219 13.719c0 3.594 2.875 6.469 6.469 6.469s6.469-2.875 6.469-6.469-2.875-6.469-6.469-6.469-6.469 2.875-6.469 6.469z"></path>';
    
    svgSpriteContainer.appendChild(symbol);

    // Rotate Left icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-rotateLeft');
    symbol.setAttribute('viewBox', '0 0 24 24');
    symbol.innerHTML = '<path fill-rule="evenodd" clip-rule="evenodd" d="M6.23706 2.0007C6.78897 2.02117 7.21978 2.48517 7.19931 3.03708L7.10148 5.67483C8.45455 4.62548 10.154 4.00001 12 4.00001C16.4183 4.00001 20 7.58174 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 11.4477 4.44772 11 5 11C5.55228 11 6 11.4477 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68631 15.3137 6.00001 12 6.00001C10.4206 6.00001 8.98317 6.60994 7.91098 7.60891L11.3161 8.00677C11.8646 8.07087 12.2573 8.56751 12.1932 9.11607C12.1291 9.66462 11.6325 10.0574 11.0839 9.99326L5.88395 9.38567C5.36588 9.32514 4.98136 8.87659 5.00069 8.35536L5.20069 2.96295C5.22116 2.41104 5.68516 1.98023 6.23706 2.0007Z" />';
    
    svgSpriteContainer.appendChild(symbol);

    // Rotate Right icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-rotateRight');
    symbol.setAttribute('viewBox', '0 0 24 24');
    symbol.innerHTML = '<path fill-rule="evenodd" clip-rule="evenodd" d="M17.7629 2.0007C17.211 2.02117 16.7802 2.48517 16.8007 3.03708L16.8985 5.67483C15.5455 4.62548 13.846 4.00001 12 4.00001C7.58172 4.00001 4 7.58174 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68631 8.68629 6.00001 12 6.00001C13.5794 6.00001 15.0168 6.60994 16.089 7.60891L12.6839 8.00677C12.1354 8.07087 11.7427 8.56751 11.8068 9.11607C11.8709 9.66462 12.3675 10.0574 12.9161 9.99326L18.1161 9.38567C18.6341 9.32514 19.0186 8.87659 18.9993 8.35536L18.7993 2.96295C18.7788 2.41104 18.3148 1.98023 17.7629 2.0007Z" />';
    
    svgSpriteContainer.appendChild(symbol);

    // Play icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-play');
    symbol.setAttribute('viewBox', '0 0 24 24');
    symbol.innerHTML = '<path fill-rule="evenodd" clip-rule="evenodd" d="M5.46484 3.92349C4.79896 3.5739 4 4.05683 4 4.80888V19.1911C4 19.9432 4.79896 20.4261 5.46483 20.0765L19.1622 12.8854C19.8758 12.5108 19.8758 11.4892 19.1622 11.1146L5.46484 3.92349ZM2 4.80888C2 2.55271 4.3969 1.10395 6.39451 2.15269L20.0919 9.34382C22.2326 10.4677 22.2325 13.5324 20.0919 14.6562L6.3945 21.8473C4.39689 22.8961 2 21.4473 2 19.1911V4.80888Z" />';
    
    svgSpriteContainer.appendChild(symbol);

    // Pause icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-pause');
    symbol.setAttribute('viewBox', '0 0 24 24');
    symbol.innerHTML = '<path fill-rule="evenodd" clip-rule="evenodd" d="M10 5C10 3.34315 8.65686 2 7 2H5C3.34315 2 2 3.34315 2 5V19C2 20.6569 3.34315 22 5 22H7C8.65686 22 10 20.6569 10 19V5ZM8 5C8 4.44772 7.55229 4 7 4H5C4.44772 4 4 4.44772 4 5V19C4 19.5523 4.44772 20 5 20H7C7.55229 20 8 19.5523 8 19V5Z" /><path fill-rule="evenodd" clip-rule="evenodd" d="M22 5C22 3.34315 20.6569 2 19 2H17C15.3431 2 14 3.34315 14 5V19C14 20.6569 15.3431 22 17 22H19C20.6569 22 22 20.6569 22 19V5ZM20 5C20 4.44772 19.5523 4 19 4H17C16.4477 4 16 4.44772 16 5V19C16 19.5523 16.4477 20 17 20H19C19.5523 20 20 19.5523 20 19V5Z" />';
    
    svgSpriteContainer.appendChild(symbol);

    // Share icon.
    symbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');
    symbol.setAttribute('id', 'pg-icon-share');
    symbol.setAttribute('viewBox', '0 0 24 24');
    symbol.innerHTML = '<path fill-rule="evenodd" clip-rule="evenodd" d="M13.803 5.33333C13.803 3.49238 15.3022 2 17.1515 2C19.0008 2 20.5 3.49238 20.5 5.33333C20.5 7.17428 19.0008 8.66667 17.1515 8.66667C16.2177 8.66667 15.3738 8.28596 14.7671 7.67347L10.1317 10.8295C10.1745 11.0425 10.197 11.2625 10.197 11.4872C10.197 11.9322 10.109 12.3576 9.94959 12.7464L15.0323 16.0858C15.6092 15.6161 16.3473 15.3333 17.1515 15.3333C19.0008 15.3333 20.5 16.8257 20.5 18.6667C20.5 20.5076 19.0008 22 17.1515 22C15.3022 22 13.803 20.5076 13.803 18.6667C13.803 18.1845 13.9062 17.7255 14.0917 17.3111L9.05007 13.9987C8.46196 14.5098 7.6916 14.8205 6.84848 14.8205C4.99917 14.8205 3.5 13.3281 3.5 11.4872C3.5 9.64623 4.99917 8.15385 6.84848 8.15385C7.9119 8.15385 8.85853 8.64725 9.47145 9.41518L13.9639 6.35642C13.8594 6.03359 13.803 5.6896 13.803 5.33333Z" />';
    
    svgSpriteContainer.appendChild(symbol);

    // Append other symbols if needed.
    // ...

    // Append Sprite Container to HTML.
    document.body.appendChild(svgSpriteContainer);    
}

/**
 * Get a DOM element for an icon.
 * @param {string} groupName - The CSS class that is used for this category of icon.
 * @param {string} iconId - The label of the icon to use.
 * @returns {element} A DOM element containing the icon. 
 * @memberof module:preciousGallery
 */
function getIconElement(groupName, iconId) {
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');  // The icon is an SVG element.
    
    svgElement.setAttribute('class', 'pg-icon-' + groupName + ' pg-'+groupName+'-'+ iconId); // Set CSS classes for the icon.

    // Add reference to the icon container defined previously in function initIcons.
    const useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    useElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#pg-icon-'+iconId);
    
    svgElement.appendChild(useElement);

    return svgElement;
}

//
//  Global Database.
//

// Create a database (array) for the current element.
var database = [];

/**
 * Add the gallery DOM attributes to the database.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function addDatabase(element) {    
    // build database structure
    databaseEntry={};
    databaseEntry['element']=element;
    databaseEntry['gallery']={};
    databaseEntry['thumbnail']=[];   
    databaseEntry['lightbox']={};

    /*
     * build gallery attributes database. 
    */

    // Parse the data-gallery attribute as JSON.
    const galleryDataString = element.getAttribute("data-gallery");
    let parsedGalleryData;
    try {
        parsedGalleryData = JSON.parse(galleryDataString);
    } catch (error) {
        console.error("Invalid JSON data-gallery:", error);
        parsedGalleryData = {};
    }

    // Validate the parsed data.
    parsedGalleryData.style = parsedGalleryData.style.toLowerCase();
    parsedGalleryData.padding=parseInt(parsedGalleryData.padding);
    parsedGalleryData.gap=parseInt(parsedGalleryData.gap);
    parsedGalleryData.thumbnailSize=parseInt(parsedGalleryData.thumbnailSize);
    parsedGalleryData.maxThumbnailDisplay=parseInt(parsedGalleryData.maxThumbnailDisplay);

    const validatedGalleryData = {
        style: parsedGalleryData.style || "masonry",
        padding: (parsedGalleryData.padding>=0) ? parsedGalleryData.padding : 0,
        gap: (parsedGalleryData.gap>=0) ? parsedGalleryData.gap : 20,
        thumbnailSize: (parsedGalleryData.thumbnailSize>0) ? parsedGalleryData.thumbnailSize : 300,
        maxThumbnailDisplay: (parsedGalleryData.maxThumbnailDisplay>=0) ? parsedGalleryData.maxThumbnailDisplay : 0,
        displaySearch: parsedGalleryData.hasOwnProperty("displaySearch") ? parsedGalleryData.displaySearch : true,
        displayCategories: parsedGalleryData.hasOwnProperty("displayCategories") ? parsedGalleryData.displayCategories : true,
        displayThumbnailText: parsedGalleryData.hasOwnProperty("displayThumbnailText") ? parsedGalleryData.displayThumbnailText : true,
        displayTitle: parsedGalleryData.hasOwnProperty("displayTitle") ? parsedGalleryData.displayTitle : false
    };
    
    databaseEntry['gallery'] = validatedGalleryData;          

    // build thumbnail database.
    const children = element.children;

    for (let i = 0; i < children.length; i++) {
        // Parse the data-thumbnail attribute as JSON.
        const thumbnailDataString = children[i].getAttribute("data-thumbnail");
        let parsedthumbnailData;
        try {
            parsedthumbnailData = JSON.parse(thumbnailDataString);
        } catch (error) {
            console.error("Invalid JSON data-thumbnail:", error);            
            parsedthumbnailData = {};
        }

        // Validate the parsed data.
        parsedthumbnailData.spanX=parseInt(parsedthumbnailData.spanX);
        parsedthumbnailData.spanY=parseInt(parsedthumbnailData.spanY);        

        const validatedThumbnailData = {
            id: i,
            src: parsedthumbnailData.src || "",
            category: parsedthumbnailData.category || "",
            title: parsedthumbnailData.title || "",
            description: parsedthumbnailData.description || "",           
            spanX: (parsedthumbnailData.spanX>=0) ?  parsedthumbnailData.spanX : 0,
            spanY: (parsedthumbnailData.spanY>=0) ? parsedthumbnailData.spanY : 0,
            content: children[i].innerHTML,
            display: true,
            class: parsedthumbnailData.class || ""
        };
        
        databaseEntry['thumbnail'].push(validatedThumbnailData); 
    }    

    // Add categories.
    let categories = new Set();    
   
    for (let i = 0; i < databaseEntry['thumbnail'].length; i++) {
        // build a set of categories.
        const category = databaseEntry['thumbnail'][i]['category'];
        
        if (category && category!="" && category!=strAllCategory) {
            categories.add(category);
        }
    }         

    // Convert the Set to an array.
    const categoriesArray = Array.from(categories);

    // Sort the array.
    categoriesArray.sort();

    // Save it to the database.
    databaseEntry["gallery"]["categories"] = categoriesArray;

    // Add lightbox init values
    databaseEntry['lightbox']['display']=false;
    databaseEntry["lightbox"]["zoomLevel"] = 1;
    databaseEntry["lightbox"]["fullscreen"] = false;
    databaseEntry['lightbox']['displayMiniatures']=false;
    databaseEntry['lightbox']['maxZoom']=2;
    databaseEntry['lightbox']['currentThumbnailId']=0;
    databaseEntry['lightbox']['minimalDisplay']=false;
    databaseEntry['lightbox']['timeoutId']=-1;

    // Add the current element to the database.
    database.push(databaseEntry); 

    return databaseEntry;
}

/**
 * Find the data corresponding to the gallery DOM element.
 * @param {element} element - The gallery topmost DOM element.
 * @returns {object} An object containing the information related to the DOM element.
 * @memberof module:preciousGallery
 */
function getData(element) {
    // Find the entry corresponding to element.
    const index = database.findIndex(entry => entry['element'] === element);

    // Check if the entry was found.
    if (index !== -1) {        
        // Entry found: return the entry.
        return database[index];
    } else {
        // No entry found. Throw an error.
        throw new Error("Element not found.");
    }
}

//
//  Gallery.
//

/**
 * Create a gallery inside the DOM element.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function createGallery(element, data) {
//    const data=getData(element); // Get the database information related to element.

    // Insert the top element.
    let topElement = document.createElement('div');
    topElement.className = 'pg-gallery';

    let divElement; // A general purpose div element.
    let childElement; // A general purpose child div element.

    // Insert top bar.
    const topBarElement = document.createElement('div');
    topBarElement.className = 'pg-topBar';

    // Insert categories.
    divElement = document.createElement('div');
    divElement.className = 'pg-categories';

    // Insert "all" category.
    data["gallery"]["categorySelected"]=strAllCategory;
    childElement = document.createElement('button');
        childElement.className = 'pg-button pg-button-selected';
        childElement.innerText = strAllCategory;
        childElement.onclick = function() {
            thumbnailSelect(element,strAllCategory);            
        };

    divElement.appendChild(childElement);

    // Insert other categories.
    data["gallery"]["categories"].forEach(function(category) {
        childElement = document.createElement('button');
        childElement.className = 'pg-button';
        childElement.innerText = category;
        childElement.onclick = function() {
            thumbnailSelect(element, category);
        };
        divElement.appendChild(childElement);
    });

    if(data["gallery"]["displayCategories"]==false) { 
        divElement.style.display = "none";
    }

    topBarElement.appendChild(divElement);        

    // Insert searchbox.
    divElement = document.createElement('div');
    divElement.className = 'pg-searchbox';

    // Insert search icon.
    const iconSearch=getIconElement('gallery', 'search');    
    divElement.appendChild(iconSearch);

    // Insert Search input.
    childElement = document.createElement('input');
    childElement.className = 'pg-search-input';
    childElement.setAttribute("type", "text");
    childElement.setAttribute("name", "searchText");
    childElement.setAttribute("placeholder", "Search...");
    childElement.addEventListener("input", function() {        
        thumbnailSelect(element, "")
    });
    divElement.appendChild(childElement);

    // Insert search close icon.
    const iconClose=getIconElement('gallery', 'close');
    iconClose.onclick = function() {            
        eraseSearchString(element);                              
    };   
    divElement.appendChild(iconClose);

    if(data["gallery"]["displaySearch"]==false) {  
        divElement.style.display = "none";
    }

    topBarElement.appendChild(divElement);

    topElement.appendChild(topBarElement);
    
    // Insert thumbnails
    divElement = document.createElement('div');
    divElement.className = 'pg-thumbnails';

    for(const thumbnail of data['thumbnail']) {
        // insert thumbnail.
        const childElement = createThumbnail(element, thumbnail);
        divElement.appendChild(childElement);

        // Add thumbnail information.
        thumbnail['display'] = true;
        thumbnail['element'] = childElement;
    }

    topElement.appendChild(divElement);

    // Insert top element into the gallery.
    element.appendChild(topElement);
}

/**
 * Create a thumbnail element.
 * @param {element} element - The gallery topmost DOM element. 
 * @param {object} dataThumbnail - The thumbnail data.
 * @returns The thumbnail DOM element.
 * @memberof module:preciousGallery
 */
function createThumbnail(element, dataThumbnail) {
    const data=getData(element); // Get the database information related to element.

    // Create thumbnail.
    const thumbnail = document.createElement('div');
    thumbnail.className = ('pg-thumbnail '+ dataThumbnail['class']).trim();

    // Add click event. When a thumbnail is clicked, it opens the lightbox.
    thumbnail.onclick = function() {            
        openLightbox(element, dataThumbnail);                       
    };     

    // Add inside thumbnail div.
    const inside = document.createElement('div');
    inside.className = "pg-thumbnail-inside";
    thumbnail.appendChild(inside);

    // Add image.
    const image = document.createElement('img');
    image.className = "pg-thumbnail-image";
    image.src = dataThumbnail['src'];
    inside.appendChild(image);

    // Add title.
    const title = document.createElement('div');
    title.className = "pg-thumbnail-title";
    title.innerText = dataThumbnail['title'];

    if(data['gallery']['displayTitle'] && dataThumbnail['title'] && dataThumbnail['title']!="") {
        title.style.display="block";
    } else {
        title.style.display="none";
    }

    inside.appendChild(title);

    // Add overlay.
    const overlay = document.createElement('div');
    overlay.className = "pg-thumbnail-overlay";
//    overlay.innerText="";
    inside.appendChild(overlay);

    // Add foreground.
    const foreground = document.createElement('div');
    foreground.className = "pg-thumbnail-foreground";
    inside.appendChild(foreground);
    
    return thumbnail;
}

/**
 * Resize the thumbnail element.
 * @param {element} thumbnail - The thumbnail DOM element
 * @param {float} width - The width of the thumbnail (in pixels).
 * @param {float} height - The height of the thumbnail (in pixels).
 * @memberof module:preciousGallery
 */
function resizeThumbnail(thumbnail, width, height) {
    const inside=thumbnail.getElementsByClassName("pg-thumbnail-inside")[0];
    const computedStyle = window.getComputedStyle(inside);
    const image=thumbnail.getElementsByClassName("pg-thumbnail-image")[0];
    const title=thumbnail.getElementsByClassName("pg-thumbnail-title")[0];
    const overlay=thumbnail.getElementsByClassName("pg-thumbnail-overlay")[0];

    if(width>0) {
        thumbnail.style.width=`${width}px`;
        inside.style.width=`${width}px`;

        const insideWidth = inside.clientWidth - 
            parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
            
        image.style.width=`${insideWidth}px`;
        title.style.width=`${insideWidth}px`;                
    }

    if(height>0) {
        thumbnail.style.height=`${height}px`;
        inside.style.height=`${height}px`;
        
        const insideHeight = inside.clientHeight - 
            parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom);

        image.style.height=`${insideHeight-title.offsetHeight}px`;
    }
}

/**
 * Create event handlers for images (when finished loading and when the window is resized).
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function createImgHandler(element) {
    const data=getData(element); // Get the database information related to element.

    // Attach a load event handler to all thumbnail images.
    for(const thumbnail of data['thumbnail']) {
        const image=thumbnail['element'].getElementsByClassName("pg-thumbnail-image")[0];

        image.addEventListener('load', () => {            
            placeThumbnails(element);
          });
    }

    // Attach a handler for the window's resize event.
    window.addEventListener('resize', () => {
        placeThumbnails(element);
    });
}

/**
 * PLace the thumbnails inside the gallery according to the configured style.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function placeThumbnails(element) {
    const data=getData(element); // Get the database information related to element.

    const style=data['gallery']['style']; // Get the configured gallery style.

    // Select gallery placement function according to style.
    if(style=="masonry") {    
        placeMasonry(element);  
    } else if(style=="grid") {
        placeGrid(element);
    } else if(style=="horizontal") {
        placeHorizontal(element);
    } else if(style=="mosaic") {
        placeMosaic(element);
    } else {
        // Masonry is the default style.
        placeMasonry(element);
    }
}

/**
 * Place thumbnails according to the masonry style.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function placeMasonry(element) {
    const data=getData(element); // Get the database information related to element.
    const thumbnails=element.getElementsByClassName("pg-thumbnails")[0]; // Get the thumbnails DOM element.

    const padding = data['gallery']['padding']; // Padding space inside the gallery (in pixels).
    const gap = data['gallery']['gap']; // Gap space between thumbnaisl (in pixels).
    const thumbnailSize = data['gallery']['thumbnailSize']; // Width of thumbnails (in pixels).

    // Number of columns to display.
    let numberColumn=parseInt((thumbnails.offsetWidth-2*padding)/thumbnailSize); 
    if(numberColumn < 1)  numberColumn=1;    

    let colWidth = (thumbnails.offsetWidth-2*padding-(numberColumn-1)*gap)/numberColumn; // Width of a column (in pixels).
    let colX=0; // Column index. 
    let startY = new Array(numberColumn).fill(padding); // The starting position of columns (in pixels).
    let filled = new Array(numberColumn).fill(false); // Keep track if columns have at least one thumbnail in them.

    // Go through all thumbnails.
    for(const thumbnail of data['thumbnail']) {  
        const thumbnailElement=thumbnail['element']; // Get the image DOM element of the thumbnail.
        const img=thumbnailElement.getElementsByClassName("pg-thumbnail-image")[0];
        
        // Look if the thumbnail must be displayed and has finished loading.
        if(thumbnail['display'] && img.complete) {
            resizeThumbnail(thumbnailElement, colWidth, -1); // Set image width to fit column.

            if(filled[colX]) startY[colX]+=gap; // Add gap space if a thumbnail was already on top.
        
            // Place thumbnail image.
            thumbnailElement.style.left = `${(colX*(colWidth+gap))+padding}px`;
            thumbnailElement.style.top = `${startY[colX]}px`;      
            thumbnailElement.style.visibility  = "visible";      

            // Keep track of the next height position in the column.
            startY[colX]+=thumbnailElement.offsetHeight;
            filled[colX]=true;

            // Go to next column.
            colX++;
            if(colX>=numberColumn) {
                colX=0;
            }
        } else {
            // Hide this thumbnail: either it has been filtered out by the search or it hasn't finished loading.
            thumbnailElement.style.visibility  = "hidden";
        }    
    }
    
    // Adjust the height of the gallery thumbnails.
    const maxHeight = Math.ceil(Math.max(...startY));
    thumbnails.style.height=`${maxHeight+padding}px`;
}

/**
 * Place thumbnails according to the grid style.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function placeGrid(element) {
    const data=getData(element); // Get the database information related to element.
    const thumbnails=element.getElementsByClassName("pg-thumbnails")[0]; // Get the thumbnails DOM element.

    const padding = data['gallery']['padding']; // Padding space inside the gallery (in pixels).
    const gap = data['gallery']['gap']; // Gap space between thumbnaisl (in pixels).
    const thumbnailSize = data['gallery']['thumbnailSize']; // Width of thumbnails (in pixels).

    // Number of columns to display.
    let numberColumn=parseInt((thumbnails.offsetWidth-2*padding)/thumbnailSize);
    if(numberColumn<1)  numberColumn=1;

    let colWidth = (thumbnails.offsetWidth-2*padding-(numberColumn-1)*gap)/numberColumn; // Width of one column (in pixels).
    let colX=0; // Column index.
    let startY = new Array(numberColumn).fill(padding); // The starting position of columns (in pixels).
    let filled = new Array(numberColumn).fill(false); // Keep track if columns have at least one thumbnail in them.

    // Go through all thumbnails.
    for(const thumbnail of data['thumbnail']) {  
        const thumbnailElement=thumbnail['element']; // Get the image DOM element of the thumbnail.
        const img=thumbnailElement.getElementsByClassName("pg-thumbnail-image")[0];
        
        // Look if the thumbnail must be displayed and has finished loading.
        if(thumbnail['display'] && img.complete) {            
            resizeThumbnail(thumbnailElement, colWidth, colWidth); // Adjust size of thumbnail.            

            if(filled[colX]) startY[colX]+=gap; // Add gap space if a thumbnail was already on top.
            
            // Place thumbnail image.
            thumbnailElement.style.left = `${(colX*(colWidth+gap))+padding}px`;
            thumbnailElement.style.top = `${startY[colX]}px`;            
            thumbnailElement.style.visibility  = "visible";

            // Keep track of the next height position in the column.
            startY[colX]+=thumbnailElement.offsetHeight;
            filled[colX]=true;

            // Go to next column.
            colX++;
            if(colX>=numberColumn) {
                colX=0;
            }
        } else {
            // Hide this thumbnail: either it has been filtered out by the search or it hasn't finished loading.
            thumbnailElement.style.visibility  = "hidden";
        }    
    }
    
    // Adjust the height of the gallery thumbnails.
    const maxHeight = Math.ceil(Math.max(...startY));
    thumbnails.style.height=`${maxHeight+padding}px`;
}

/**
 * Place thumbnails according to the horizontal style.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function placeHorizontal(element) {    
    const data=getData(element); // Get the database information related to element.
    const thumbnails=element.getElementsByClassName("pg-thumbnails")[0]; // Get the thumbnails DOM element.

    const padding = data['gallery']['padding']; // Padding space inside the gallery (in pixels).
    const gap = data['gallery']['gap']; // Gap space between thumbnaisl (in pixels).
    const thumbnailSize = data['gallery']['thumbnailSize']; // Height of thumbnails (in pixels).

    let width=thumbnails.offsetWidth-2*padding; // Width of one row (in pixels).
    let numberRow = 0; // The number of allocated rows.
    let startX = []; // An array containing the starting offset of each row (in pixels).
    let allocateImg = []; // An array containing the thumbnail images that have been allocated in each row.
    
    // Go through all thumbnails.
    for(const thumbnail of data['thumbnail']) {  
        const thumbnailElement=thumbnail['element']; // Get the image DOM element of the thumbnail.
        const img=thumbnailElement.getElementsByClassName("pg-thumbnail-image")[0];      
        
        // Look if the thumbnail must be displayed and has finished loading.
        if(thumbnail['display'] && img.complete) {        
            const newWidth = (thumbnailSize/thumbnailElement.offsetHeight)*thumbnailElement.offsetWidth;
            const newHeight = thumbnailSize;   
            resizeThumbnail(thumbnailElement, newWidth, newHeight); // set the height of the thumbnail.

            // Find a spot in a row with free space.
            let foundSpot=false;
            let i=0;

            // Go through each row.
            while(i<numberRow && !foundSpot) {
                if((startX[i]+thumbnailElement.offsetWidth) < width) {
                    foundSpot=true;

                    startX[i]+=thumbnailElement.offsetWidth+gap;  
                    allocateImg[i].push(thumbnailElement);                                 
                }

                i++;
            }

            // If no spot was found, allocate a new row.
            if(!foundSpot) {
                startX.push(thumbnailElement.offsetWidth+gap); 

                allocateImg.push([]);      
                allocateImg[numberRow].push(thumbnailElement);              

                numberRow++;
            }
        } else {
            // Hide this thumbnail: either it has been filtered out by the search or it hasn't finished loading.
            thumbnailElement.style.visibility  = "hidden";
        }   
    }

    // Adjust rows height so that the width of all rows are equal and place thumbnails.
    let top=0; // Top position (in pixels).

    // Go through all rows.
    for(let i=0; i<allocateImg.length; i++) {
        const rowHeight = thumbnailSize*(width-(allocateImg[i].length-1)*gap)/(startX[i]-(allocateImg[i].length*gap)); // Calculate the new justified row width.      
        let left=0; // Left position (in pixels).

        // Go through all thumbnails in the current row.
        for(let j=0; j<allocateImg[i].length; j++) {  
            const img=allocateImg[i][j];
            const newWidth = (rowHeight/img.offsetHeight)*img.offsetWidth;
            const newHeight = rowHeight;

            // Position the thumbnail on the row.
            img.style.left = `${padding+left}px`;
            img.style.top = `${padding+top}px`;          
            img.style.visibility  = "visible";

//            console.log(newWidth+" "+newHeight);  
            resizeThumbnail(img, newWidth, newHeight); // Adjust height of thumbnail.  
//console.log(newWidth+" "+newHeight); 
        
            // Calculate the position of the next thumbnail on the current row.
            left+=img.offsetWidth+gap;
        }

        // Next row position.
        top+=rowHeight+gap;
    }

    // Adjust the height of the gallery thumbnails.
    thumbnails.style.height=`${2*padding+top-gap}px`;
}

/**
 * Place thumbnails according to the mosaic style.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function placeMosaic(element) {
    const data=getData(element); // Get the database information related to element.
    const thumbnails=element.getElementsByClassName("pg-thumbnails")[0]; // Get the thumbnails DOM element.

    const padding = data['gallery']['padding']; // Padding space inside the gallery (in pixels).
    const gap = data['gallery']['gap']; // Gap space between thumbnaisl (in pixels).
    const thumbnailSize = data['gallery']['thumbnailSize']; // Size of one block (in pixels).

    let numberRow = 1; // Number of rows in the gallery.

    // Calculate the number of columns in the gallery.
    let numberCol = parseInt((thumbnails.offsetWidth-2*padding)/thumbnailSize); 
    if(numberCol<1)  numberCol=1;

    // Calculate the size of one block (in pixels).
    const adjustedSize = (thumbnails.offsetWidth-2*padding-(numberCol-1)*gap)/numberCol;

    let BlocAllocate = new Array(numberRow); // An boolean array of array containing the block spaces allocation.
    BlocAllocate[0] = new Array(numberCol).fill(false); // Allocate the first row of blocks. 

    /**
     * Find an empty spot to allocate a bloc.
     * @param {integer} spanX - The width of the bloc in cell units. 
     * @param {integer} spanY  - The height of the bloc in cell units.
     * @param {boolean[][]} BlocAllocate - A 2D table of booleans indicating if a cell has been allocated (true) or not (false).
     * @returns {object} The X and Y position of the bloc or {-1,-1} if no spot was found.
     */
    function allocate(spanX, spanY, BlocAllocate) {
        let posX=-1; // X position of allocated block.
        let posY=-1; // Y position of allocated block.       

        let x1; // Current starting block X position.
        let y1; // Current starting block Y position.
        let exit=false; // Exit current search loop.
        let found; // True if block space found. False otherwise.

        // Search for a space big enough to contain the block.
        x1=0;
        y1=0;
        while(!exit) {
            // Go through all availble spaces.
            if(x1<numberCol && y1<numberRow) {
                found=true; // Assume for now that there is space available.

                // Attempt to fit in the block in the current space.
                for(let i=x1; i<(x1+spanX); i++) {
                    for(let j=y1; j<(y1+spanY); j++) {
                        if(i<numberCol && j<numberRow) {                            
                            if(BlocAllocate[j][i]) found=false; // Already allocated: space isn't available after all.
                        } else {
                            found=false; // Overflow: space isn't available after all.
                        }
                    }
                }                

                // Go to next space.
                if(!found) {
                    x1++;
                    if(x1>=numberCol) {
                        x1=0;
                        y1++;
                    }

                    if(y1>=numberRow)  exit=true;
                } else {
                    // Space found. Save this position.
                    posX=x1;
                    posY=y1;
                    exit=true;
                }
            }
        }

        // If a space was found, allocate/reserve that space in the array.
        if(found) {
            for(let i=x1; i<(x1+spanX); i++) {
                for(let j=y1; j<(y1+spanY); j++) {
                    BlocAllocate[j][i]=true;
                }
            }
        }

        // Return the position of the allocated block.
        return {posX, posY};
    }

    // Go through all thumbnails.
    for(const thumbnail of data['thumbnail']) {  
        const thumbnailElement=thumbnail['element']; // Get the image DOM element of the thumbnail.
        const img=thumbnailElement.getElementsByClassName("pg-thumbnail-image")[0];
        
        // Look if the thumbnail must be displayed and has finished loading.
        if(thumbnail['display'] && img.complete) {  
            let spanX = thumbnail['spanX']; // Get the width of the thumbnail (in block units).
            let spanY = thumbnail['spanY'];  // Get the height of the thumbnail (in block units).
            
            // Reduce the size of the thumbnail if the screen is too small.
            if(spanX>numberCol) spanX=numberCol;
            if(spanY>numberCol) spanY=numberCol;

            resizeThumbnail(thumbnailElement, spanX*adjustedSize+(spanX-1)*gap, spanY*adjustedSize+(spanY-1)*gap); // Set the size of the thumbnail.

            // Place the thumbnail.
            let found=false;
            do {
                // Attempt to find an empty spot to place the thumbnail.
                const {posX, posY} = allocate(spanX, spanY, BlocAllocate);   
                
                // Check if a spot was found.
                if(posX < 0 || posY < 0) {
                    // Not found: Allocate a new row.
                    BlocAllocate.push(new Array(numberCol).fill(false)); 
                    numberRow++;                    
                } else {
                    // Found: place the thumbnail.
                    thumbnailElement.style.left = `${padding+posX*(adjustedSize+gap)}px`;
                    thumbnailElement.style.top = `${padding+posY*(adjustedSize+gap)}px`;          
                    thumbnailElement.style.visibility  = "visible";

                    found=true;
                }
            } while(!found);            
        } else {
            // Hide this thumbnail: either it has been filtered out by the search or it hasn't finished loading.
            thumbnailElement.style.visibility  = "hidden";
        }    
    }

    // Adjust the height of the gallery thumbnails.
    thumbnails.style.height=`${2*padding+(numberRow*adjustedSize)+(numberRow-1)*gap}px`;
}

/**
 * Select the category of thumbnails to be displayed.
 * @param {element} element - The gallery topmost DOM element.
 * @param {string} category - The category to display.
 * @memberof module:preciousGallery
 */
function thumbnailSelect(element, category) {
    const data=getData(element); // Get the database information related to element.
    const buttons = element.getElementsByClassName("pg-categories")[0].children; // The category buttons DOM element.
    const search = element.getElementsByClassName("pg-search-input")[0].value; // The search box input DOM element.
    
    // Retrieve and save category information.
    if(category=="") {
        category=data["gallery"]["categorySelected"];
    } else {
        data["gallery"]["categorySelected"]=category;        
    }

    // Set category button to selected.
    for (const button of buttons) {        
        const text=button.innerText;
        
        if(category == text) {
            button.className = 'pg-button pg-button-selected';            
        } else {
            button.className = 'pg-button';
        }
    }
    
    // Select the thumbnails to be displayed.
    data["thumbnail"].forEach(function(thumbnail) {
        // Only consider the thumbnails that match the category.
        if(thumbnail['category']==category || category==strAllCategory) {
            // Also check if the thumbnail matches the search text.
            if(search=="" || 
                searchText(search, thumbnail['category']) || 
                searchText(search, thumbnail['title']) || 
                searchText(search, thumbnail['description'])) {
                
                // There's a match: display this thumbnail.
                thumbnail['display']=true;

            } else {
                // The thumbnail doesn't match the search text: do not display.
                thumbnail['display']=false;
            }
        } else {
            // The thumbnail doesn't match the category: do not display.
            thumbnail['display']=false;
        }
    })

    // Reposition the display of thumbnails.
    placeThumbnails(element);
}

/**
 * Look if a text contains a word in a string.
 * @param {string} searchStr - The string containing words to look for.
 * @param {string} text - The text to look for words included in it.
 * @returns {boolean} True if searchStr is contained in text. False otherwise.
 * @memberof module:preciousGallery
 */
function searchText(searchStr, text) {
    // if either input string is missing return no match.
    if(!searchStr || !text)  return false;
    if(searchStr.length==0 || text.length==0)  return false;

    // Segment the search string into words and convert both strings with no spaces and lowercase.
    const words = searchStr.trim().toLowerCase().split(" ");
    const textLowerCase = text.trim().toLowerCase();
  
    // Check if one word is included in the text.
    for (let word of words) {
        word=word.trim();
        if (word!="" && textLowerCase.includes(word)) {
            // One word matched.
            return true;
        }
    }
  
    // No match.
    return false;
} 

/**
 * Erase the content of the search input box.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function eraseSearchString(element) {
    // Get the search input box element.
    const searchInput = element.getElementsByClassName("pg-search-input")[0];

    // Erase the string content.
    searchInput.value="";

    // Refresh the display of thumbnails.
    thumbnailSelect(element, "");
}

//
//  Lightbox
//

/**
 * Create a lightbox.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function createLightbox(element, data) {
//    const data=getData(element); // Get the database information related to element.

    let topElement = document.createElement('div'); // The top DOM element of the lightbox.
    topElement.className = 'pg-lightbox';  
    topElement.style.display="none";  

    let modalElement = document.createElement('div'); // The background DOM element of the lightbox.
    modalElement.className = 'pg-lightbox-modal'; 
    topElement.appendChild(modalElement); 

    let divElement; // A general purpose DOM element.
    let childElement; // A general purpose DOM child element.

    // Insert header.
    const headerElement = document.createElement('div');
    headerElement.className = 'pg-lightbox-header'; 
    modalElement.appendChild(headerElement);
    
    // Insert page index.
    divElement = document.createElement('div');
    divElement.className = 'pg-lightbox-pageIndex';   
    headerElement.appendChild(divElement);

    // insert menu.
    divElement = document.createElement('div');
    divElement.className = 'pg-lightbox-menu';   

    // Zoom out icon.
    const iconZoomOut=getIconElement('lightbox', 'zoomOut');
    iconZoomOut.onclick = function() {
        lightboxZoom(element, -1, true);      
        updateLightbox(element);      
    };
    divElement.appendChild(iconZoomOut);

    // Zoom in icon.
    const iconZoomIn=getIconElement('lightbox', 'zoomIn');
    iconZoomIn.onclick = function() {
        lightboxZoom(element, 1, true);         
        updateLightbox(element);   
    };
    divElement.appendChild(iconZoomIn);

    // Fullscreen icon.
    const iconFullScreen=getIconElement('lightbox', 'fullscreen');
    iconFullScreen.onclick = function() {            
        enterFullscreen(element, topElement);                              
    };   
    divElement.appendChild(iconFullScreen);

    // Fullscreen exit icon.
    const iconFullScreenExit=getIconElement('lightbox', 'fullscreenExit');
    iconFullScreenExit.onclick = function() {                 
        leaveFullscreen(element);                          
    };   
    divElement.appendChild(iconFullScreenExit);

    // Handle the fullscreen change event.
    document.addEventListener("fullscreenchange", function () {        
        if (!document.fullscreenElement) {           
            data['lightbox']['fullscreen']=false;
            
            updateLightbox(element);
        }
    });

    // Toggle miniatures icon.
    const iconMiniatures = getIconElement('lightbox', 'miniatureIcon');
    iconMiniatures.onclick = function() {            
        toggleMiniatures(element);                          
    };     
    divElement.appendChild(iconMiniatures);

    // Toggle download icon.
    const iconDownload = getIconElement('lightbox', 'download');
    iconDownload.onclick = function() {                 
        downloadImage(element);                          
    };   
    divElement.appendChild(iconDownload);

    // Futur icons.
/*    
    let icon;
    icon=getIconElement('lightbox', 'rotateLeft');
    divElement.appendChild(icon);

    icon=getIconElement('lightbox', 'rotateRight');
    divElement.appendChild(icon);

    icon=getIconElement('lightbox', 'play');
    divElement.appendChild(icon);

    icon=getIconElement('lightbox', 'pause');
    divElement.appendChild(icon);

    icon=getIconElement('lightbox', 'share');
    divElement.appendChild(icon);
*/

    headerElement.appendChild(divElement);  

    // Insert close button.
    const iconClose=getIconElement('lightbox', 'close');
    iconClose.onclick = function() {            
        closeLightbox(element);                       
    };   

    headerElement.appendChild(iconClose);

    // Insert scrolling buttons.
    divElement = document.createElement('div');
    divElement.className = 'pg-lightbox-direction';

    const iconLeftScroll = getIconElement('lightbox', 'leftScroll');
    iconLeftScroll.onclick = function() {                 
        LightboxScroll(element, -1);                          
    };   
    divElement.appendChild(iconLeftScroll);

    const iconRightScroll = getIconElement('lightbox', 'rightScroll');
    iconRightScroll.onclick = function() {                 
        LightboxScroll(element, 1);                          
    };  
    divElement.appendChild(iconRightScroll);

    modalElement.appendChild(divElement);    

    // Insert content.     
    modalElement.appendChild(createLightboxContent(element));

    // Insert miniatures.
    divElement = document.createElement('div');
    divElement.className = 'pg-lightbox-miniatures';
    divElement.style.visibility = "hidden";

    modalElement.appendChild(divElement);

    // Insert text box.
    divElement = document.createElement('div');
    divElement.className = 'pg-lightbox-text';

    // Insert title.
    childElement = document.createElement('div');
    childElement.className = 'pg-lightbox-title';

    divElement.appendChild(childElement);

    // Insert description.
    childElement = document.createElement('div');
    childElement.className = 'pg-lightbox-description';   

    divElement.appendChild(childElement);

    modalElement.appendChild(divElement);
    
    // Timer for detecting user inactivity.
    lightboxStartTimer(element);
    
    // Event listener for detecting user activity.
    document.addEventListener("mousemove", () => {
        lightboxActivity(element);
    });

    // Insert top element into the gallery.
    element.appendChild(topElement);
}

/**
 * Create the content div element of the lightbox.
 * @param {element} element - The gallery topmost DOM element.
 * @returns {element} The DOM element containing the content of the lightbox.
 * @memberof module:preciousGallery
 */
function createLightboxContent(element) {
    const data=getData(element); // Get the database information related to element.

    let isDragging = false;  // Is the content image being dragged?
    let startX, startY; // Starting position of the drag event.
    let initialX , initialY; // Starting position of the image when dragged.

    // Insert container for the content.
    const divElement = document.createElement('div');
    divElement.className = 'pg-lightbox-container';

    // Insert the content holder.
    const childElement = document.createElement('div');
    childElement.className = 'pg-lightbox-content';     
    childElement.style.cursor = 'default'; 

    // Handle mouse down event.
    childElement.addEventListener('mousedown', (event) => {  
        // Only activate dragging mode if the zoom level is greater than 1.
        if(data['lightbox']['zoomLevel'] > 1) {
            event.preventDefault();  

            isDragging = true;     
            childElement.style.cursor = 'grabbing';                      
            
            // Keep track of dragging initial coordinates.
            startX = event.clientX;
            startY = event.clientY;
            initialX  = childElement.offsetLeft;
            initialY = childElement.offsetTop;        
        } else {
            isDragging = false;
        }
    });

    // Handle mouse up event.
    childElement.addEventListener('mouseup', () => {   
        // Only check this event if the zoom level is greater than 1.
        if(data['lightbox']['zoomLevel'] > 1) {
            isDragging = false;    
            childElement.style.cursor = 'grab';               
        }
    });

    // Handle mouse move event.
    childElement.addEventListener('mousemove', (event) => {    
        // Must be in dragging mode.    
        if (!isDragging) return;
     
        // Calculate how much to drag the content.
        const xOffset = event.clientX - startX;
        const yOffset = event.clientY - startY;
        let left = initialX + xOffset;
        let top = initialY + yOffset;
        const maxX = (childElement.clientWidth/2);
        const maxY = (childElement.clientHeight/2);

        // Saturate move offsets.
        if(left > maxX)  left=maxX;
        if(left < -maxX)  left=-maxX;
        if(top > maxY)  top=maxY;
        if(top < -maxY)  top=-maxY;

        // Position the content.
        childElement.style.left = `${left}px`;
        childElement.style.top = `${top}px`;
    });

    // Handle mouse wheel event.
    childElement.addEventListener('wheel', (event) => {
        event.preventDefault(); // Don't apply default behavior.

        // Check scrolling direction.
        if (event.deltaY > 0) {
            // Scrolling down.
            lightboxZoom(element, -1, true);
        } else if (event.deltaY < 0) {
            // Scrolling up.
            lightboxZoom(element, 1, true);
        }

        // Refresh the display.
        updateLightbox(element, "");
    });

    // Handle touch start event.
    let xDown = null; // X coordinates of first touch.                                                  
    let yDown = null; // Y coordinates of first touch.
    let leftStart; // Left offset of the content element at the start of the touch event.
    let topStart; // Top offset of the content element at the start of the touch event.
    childElement.addEventListener('touchstart', (event) => {
        // Save first touch coordinates.
        const firstTouch = event.touches[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY; 

        // Save starting position of the content element.
        leftStart = parseInt(childElement.style.left);
        topStart = parseInt(childElement.style.top);

        // Activity has been detected.
        lightboxActivity(element);
    });

    // Handle touch move event.
    childElement.addEventListener('touchmove', (event) => {
        // Return if no touch start event was previously recorded.
        if ( ! xDown || ! yDown ) {
            return;
        }

        // Get new touch coordinates.
        let xUp = event.touches[0].clientX;                                    
        let yUp = event.touches[0].clientY;

        // Calculate displacement.
        let xDiff = xUp - xDown;
        let yDiff = yUp - yDown;

        if(data['lightbox']['zoomLevel'] == 1) {        
            // Get the most significant displacement.
            if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
                // Check swipe direction.
                if ( xDiff > 0 ) {
                    // Right swipe.
                    LightboxScroll(element, -1);
                } else {
                    // Left swipe.
                    LightboxScroll(element, 1);
                }                       
            } else {
                // Check swipe direction.
                if ( yDiff > 0 ) {
                    // Down swipe.
                } else { 
                    // Up swipe.
                }                                                                 
            }

            // Reset touch start values.
            xDown = null;
            yDown = null;         
        } else {
            let left = leftStart+xDiff;
            let top = topStart+yDiff;
            const maxX = (childElement.clientWidth/2);
            const maxY = (childElement.clientHeight/2);

            // Saturate move offsets.
            if(left > maxX)  left=maxX;
            if(left < -maxX)  left=-maxX;
            if(top > maxY)  top=maxY;
            if(top < -maxY)  top=-maxY;

            // Position the content.                    
            childElement.style.left = `${left}px`;
            childElement.style.top = `${top}px`;
        }          
    });

    // Handle touch end event.
    childElement.addEventListener('touchend', (event) => {
        // Reset touch start values.
        xDown = null;
        yDown = null;     
    });

    divElement.appendChild(childElement);

    // Return the lightbox content element.
    return divElement;
}

/**
 * Show the lightbox.
 * @param {element} element - The gallery topmost DOM element.
 * @param {object} thumbnail - A database entry corresponding to the thumbnail to show.
 * @memberof module:preciousGallery
 */
function openLightbox (element, thumbnail) {  
    const data=getData(element); // Get the database information related to element.

    document.body.style.overflow = 'hidden'; // Hide the scrollbar

    // Set the zoom level to normal.
    lightboxZoom(element, 1, false);

    // Keep track of the lightbox open state.
    data['lightbox']['display']=true;

    // Handle keyboard buttons.    
    document.addEventListener('keydown', lightboxKeyDown);
    document.myParam = element;

    // Refresh the display.
    updateLightbox(element, thumbnail);
}

/**
 * Hide the ligthbox. Thus returning to the gallery.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function closeLightbox(element) {
    const data=getData(element); // Get the database information related to element.

    document.body.style.overflow = 'auto'; // Show the scrollbar again.

    // If in fullscreen mode, leave this mode.
    if(data['lightbox']['fullscreen']) {
        leaveFullscreen(element);
    }

    // Keep track of the lightbox close state.
    data['lightbox']['display']=false;

    // Set the zoom level to normal.
    lightboxZoom(element, 1, false);

    // Remove handling of keyboard buttons.
    document.removeEventListener('keydown', lightboxKeyDown);

    // Refresh the display.
    updateLightbox(element);
}

/**
 * Update the content of the lightbox.
 * @param {element} element - The gallery topmost DOM element.
 * @param {object} thumbnail - A database entry corresponding to the thumbnail to show.
 * @memberof module:preciousGallery
 */
function updateLightbox(element, thumbnail) {
    const data=getData(element); // Get the database information related to element.

    // Select display mode.
    const lightbox = element.getElementsByClassName("pg-lightbox")[0];
    if(data['lightbox']['display']==false) {        
        lightbox.style.display="none";

        return;
    } else {
        lightbox.style.display="flex";
    }    

    // Minimal mode.
    const divHeader = lightbox.getElementsByClassName("pg-lightbox-header")[0];  // The header on top element.
    const divDirection = lightbox.getElementsByClassName("pg-lightbox-direction")[0]; // The scroll icons element.
    const divText = lightbox.getElementsByClassName("pg-lightbox-text")[0]; // The text description element.

    // Select elements to display.
    if(data['lightbox']['minimalDisplay']) 
    {
        // Minimal mode. This occurs after the ligthbox has been inactive after a period of time.
        divHeader.style.opacity = 0;
        divDirection.style.opacity = 0;
        divText.style.opacity = 0;
    } else {
        // Full mode.
        divHeader.style.opacity = 1;
        divDirection.style.opacity = 1;

        // Only display text description when content isn't zoomed in.
        if(data['lightbox']['zoomLevel'] == 1) {
            divText.style.opacity = 1; 
        } else {
            divText.style.opacity = 0;
        }
    }

    // Update content element.
    if(thumbnail) {
        data['lightbox']['currentThumbnailId'] = thumbnail['id'];  // Keep track of the thumbnail currently selected.
        
        // Insert content.
        const thumbnailContent=thumbnail['content'];

        const lightboxContent = lightbox.getElementsByClassName("pg-lightbox-content")[0];
        lightboxContent.innerHTML = thumbnailContent;

        // If no content has been provided, use the thumbnail instead.
        if(lightboxContent.childElementCount==0) {            
            const img=document.createElement('img');            
            img.src = thumbnail['src'];    

            lightboxContent.appendChild(img);      
        }

        // Insert Title and description.
        divText.style.display="none";
        if(data['gallery']['displayThumbnailText']) {
            if( (thumbnail['title'].length != 0) || 
                (thumbnail['description'].length != 0) ) {
                const title=lightbox.getElementsByClassName("pg-lightbox-title")[0];
                title.innerText = thumbnail['title'];
                if(thumbnail['title'].length>0) {
                    title.style.display="block";
                } else {
                    title.style.display="none";
                }

                const description=lightbox.getElementsByClassName("pg-lightbox-description")[0];
                description.innerText = thumbnail['description'];
                if(thumbnail['description'].length>0) {
                    description.style.display="block";
                } else {
                    description.style.display="none";
                }

                divText.style.display="block";
            } else {
                divText.style.display="none";
            }
        }

        // Insert miniatures.
        const miniatures=lightbox.getElementsByClassName("pg-lightbox-miniatures")[0]; // Get miniatures element.
        miniatures.innerHTML=""; // Erase all miniatures.

        const thumbnails=data['thumbnail']; // Access database info on thumbails.
        let count=0; // Count the number of displayed miniatures.
        let index=0; // Index of a miniature.

        // Create and insert miniatures one by one.
        for(currentThumbnail of thumbnails) {
            // Check if the miniature must be displayed.
            if(currentThumbnail['display'])  {
                // Insert the miniature.
                const miniature = document.createElement('img');
                miniature.className = 'pg-lightbox-miniature';
                miniature.src = currentThumbnail['src'];            

                count++; // Keep track of number of miniatures inserted.

                // Append a special CSS class to the selected miniature.
                if(currentThumbnail['id']==thumbnail['id'])  {
                    index=count;
                    miniature.classList.add("pg-lightbox-miniature-selected");
                }

                // Handle mouse click event on all miniatures.
                const id = currentThumbnail['id'];
                miniature.onclick = function() {             
                    // Select the miniature for display when the user clicks on it.                  
                    selectMiniature(element, id);                          
                };  

                miniatures.appendChild(miniature);
            }        
        }        

        // Insert page index.
        const pageIndex=lightbox.getElementsByClassName("pg-lightbox-pageIndex")[0];        
        pageIndex.innerText = String(index)+" / "+String(count);
    }

    // Update fullscreen icons.
    const fullscreen = element.getElementsByClassName("pg-lightbox-fullscreen")[0];
    const fullscreenExit = element.getElementsByClassName("pg-lightbox-fullscreenExit")[0];

    // No need to show the fullscreen icon when already in fullscreen.
    if(data['lightbox']['fullscreen']) {
        // Hide fullscreen icon.
        fullscreen.style.display="none";
        fullscreenExit.style.display="inline";
    } else {
        // Show fullscreen exit icon.
        fullscreen.style.display="inline";
        fullscreenExit.style.display="none";
    }

    // Update miniatures.
    const miniatures = element.getElementsByClassName("pg-lightbox-miniatures")[0];

    // Check if the miniature must be displayed.
    if(data['lightbox']['displayMiniatures']) {
        // Display miniature.
        miniatures.style.visibility = "visible";

        // Position the selected miniature in the center horizontally.
        const modalElement = element.getElementsByClassName("pg-lightbox-modal")[0];
        const selectedElement = miniatures.getElementsByClassName("pg-lightbox-miniature-selected")[0];
        const modalWidth = modalElement.offsetWidth;
        const selectedPosX = selectedElement.offsetLeft;
        const selectedWidth = selectedElement.offsetWidth;
       
        miniatures.style.transform = `translateX(${(modalWidth/2)-selectedPosX-(selectedWidth/2)}px)`;
    } else {
        // Hide miniature.
        miniatures.style.visibility = "hidden";
    }

    // Update zoom content.
    const content = element.getElementsByClassName("pg-lightbox-content")[0];
    const currentZoom = data['lightbox']['zoomLevel'];
    const left = parseInt(content.style.left);
    const top = parseInt(content.style.top);

    // Set the origin of the scaling and the scale (zoom) level.
    content.style.transformOrigin = "50% 50%";
    content.style.transform = `scale(${currentZoom})`;

    // When the content isn't zoomed there's no need for panning it.
    if(currentZoom<=1) {
        content.style.left = "0px";
        content.style.top = "0px";
        content.style.cursor = 'default'; 
    }

    // Show/hide zoom in/zoom out icons.
    const zoomOut = element.getElementsByClassName("pg-lightbox-zoomOut")[0];
    if(currentZoom<=1) {
        zoomOut.style.visibility="hidden";
    } else {
        zoomOut.style.visibility="visible";
    }

    const zoomIn = element.getElementsByClassName("pg-lightbox-zoomIn")[0];
    if(currentZoom>=data['lightbox']['maxZoom']) {
        zoomIn.style.visibility="hidden";
    } else {
        zoomIn.style.visibility="visible";
    }    

    // Show/hide download icon.
    const download = element.getElementsByClassName("pg-lightbox-download")[0];
    const childrenArray = element.getElementsByClassName("pg-lightbox-content")[0].children;
    let displayDownload=false;
    
    // Only display the download icon when the content is an image (not something else like an iframe).
    if(childrenArray.length==1) {       
        if(childrenArray[0].tagName=="IMG") {
            displayDownload=true;
        }
    }

    if(displayDownload) {
        download.style.display="inline";
    } else {
        download.style.display="none";
    }

    // Start the timer to decide when to go into minimal display mode after inactivity.
    lightboxStartTimer(element);
}

/**
 * Show the topElement content in full screen mode.
 * @param {element} element - The gallery topmost DOM element.
 * @param {element} lightboxElement - The lightbox topmost DOM element.
 * @memberof module:preciousGallery
 */
function enterFullscreen (element, lightboxElement) {
    const data=getData(element); // Get the database information related to element.

    // Check if the browser supports fullscreen
    if (lightboxElement.requestFullscreen) {
        lightboxElement.requestFullscreen();
    } else if (lightboxElement.mozRequestFullScreen) { // Firefox.
        lightboxElement.mozRequestFullScreen();
    } else if (lightboxElement.webkitRequestFullscreen) { // Chrome, Safari, and Opera.
        lightboxElement.webkitRequestFullscreen();
    } else if (lightboxElement.msRequestFullscreen) { // Internet Explorer and Edge.
        lightboxElement.msRequestFullscreen();
    }

    // Keep track of fullscreen state.
    data['lightbox']['fullscreen']=true;

    // Refresh the display.
    updateLightbox(element);
}

/**
 * Go back to original screen size
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function leaveFullscreen(element) {
    const data=getData(element); // Get the database information related to element.

    // Check if the browser supports exit fullscreen
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox.
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari, and Opera.
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // Internet Explorer and Edge.
        document.msExitFullscreen();
    }     

    // Keep track of fullscreen state.
    data['lightbox']['fullscreen']=false;

    // Refresh the display.
    updateLightbox(element);
}

/**
 * Zoom lightbox content DOM element.
 * @param {element} element - The gallery topmost DOM element.
 * @param {integer} zoomLevel - The zoom level of the content.
 * @param {boolean} relative - True is the zoom level is in relative units or false if using absolute units.
 * @memberof module:preciousGallery
 */
function lightboxZoom(element, zoomLevel, relative) {
    const data=getData(element); // Get the database information related to element.

    // Update zoom level.
    let currentZoom = data['lightbox']['zoomLevel'];
    
    if(relative) {     
        // In relative mode the zoom level is added the old one.           
        currentZoom += zoomLevel;        
    } else {
        // In absolute mode the zoom level is set directly.
        currentZoom = zoomLevel;
    }

    // Saturate zoom level.
    if(currentZoom < 1) currentZoom=1;
    if(currentZoom > data['lightbox']['maxZoom']) currentZoom=data['lightbox']['maxZoom'];

    // Keep track of the zoom level.
    data['lightbox']['zoomLevel']=currentZoom; 
}

/**
 * Show/hide miniatures.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function toggleMiniatures(element) {
    const data=getData(element); // Get the database information related to element.
    
    // Toggle miniatures display state.
    data['lightbox']['displayMiniatures'] = !data['lightbox']['displayMiniatures'];

    // Refresh the display.
    updateLightbox(element);
}

/**
 * Select a miniature to display full size.
 * @param {element} element - The gallery topmost DOM element.
 * @param {integer} id - The id of the miniature.
 * @memberof module:preciousGallery
 */
function selectMiniature(element, id) {
    const data=getData(element); // Get the database information related to element.

    // Reset the zoom level to 1.
    lightboxZoom(element, 1, false);

    // Refresh the display.
    updateLightbox(element, data['thumbnail'][id]);
}

/**
 * Handle lightbox key down events.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function lightboxKeyDown(event) {
    const element = event.currentTarget.myParam; // Get the topmost element of the gallery. This is passed as an optional parameter to an event.
    const data=getData(element); // Get the database information related to element.

    // Signal that activity was detected.
    lightboxActivity(element);          

    // Scroll in the direction according to the key pressed.
    if (event.key === 'ArrowLeft') {
        LightboxScroll(element, -1);
    } else if (event.key === 'ArrowRight') {
        LightboxScroll(element, 1);
    }
}

/**
 * Scroll to the next thumbnail in the lightbox.
 * @param {element} element - The gallery topmost DOM element.
 * @param {integer} step - The number of thumbnails to scroll. Positive numbers for scrolling to the right. Negative numbers for scrolling to the left.
 * @memberof module:preciousGallery
 */
function LightboxScroll(element, step) {
    // Check validity of the step parameter.
    if (typeof step !== 'number' || !Number.isInteger(step) || step === 0) {
        throw new Error('Parameter must be a non-zero integer.');
    }

    const data=getData(element); // Get the database information related to element.
    let id=data['lightbox']['currentThumbnailId']; // The current thumbnail ID.
    let nextId=id; // The next thumbnail ID to display.
    let quit=false; // Should we quit looping?

    // Find the next ID to display.
    while (!quit) {
        id+=step; // Go in the chosen direction.

        // Check if the ID is valid.
        if (id>=0 && id<data['thumbnail'].length) {    
            if(data['thumbnail'][id]['display']) {
                nextId=id;
                quit=true;
            }            
        }
        else {
            quit=true;
        }
    }

    // Reset the zoom level to 1.
    lightboxZoom(element, 1, false);

    // Refresh the display.
    updateLightbox(element, data['thumbnail'][nextId]);
}

/**
 * Initiate an image download.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function downloadImage(element) {
    const data=getData(element); // Get the database information related to element.
    const imageDiv = element.getElementsByClassName("pg-lightbox-content")[0].children[0]; // The DOM element containing the image.
    const imageUrl = imageDiv.src; // URL of the image.

    // Create a virtual link element.
    const link = document.createElement('a');
    link.href = imageUrl;
    link.setAttribute('download', '');
    link.setAttribute('target', '_blank');

    // Dispatch a click event on the link.
    document.body.appendChild(link);
    link.click();

    // Clean up.
    document.body.removeChild(link);
}

/**
 * Start the idle timer in the lightbox.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function lightboxStartTimer(element) {
    const data=getData(element); // Get the database information related to element.

    // Initialize and start the timer.
    if(data['lightbox']['timeoutId'] != -1)  clearTimeout(data['lightbox']['timeoutId']);
    data['lightbox']['timeoutId'] = setTimeout(() => {lightboxInactivity(element);}, 3500);
}

/**
 * Called each time activity is detected in the lightbox.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function lightboxActivity(element) {
    const data=getData(element); // Get the database information related to element.

    // Restart the timer.
    lightboxStartTimer(element);

    // Go back into full display mode if previously in minimal mode.
    if(data['lightbox']['minimalDisplay']) {
        data['lightbox']['minimalDisplay']=false;
        updateLightbox(element);
    }  
}

/**
 * Called each time the lightbox has been inactive for a time period.
 * @param {element} element - The gallery topmost DOM element.
 * @memberof module:preciousGallery
 */
function lightboxInactivity(element) {
    const data=getData(element); // Get the database information related to element.

    // Go into minimal display mode.
    if(data['lightbox']['minimalDisplay']==false) {
        data['lightbox']['minimalDisplay']=true;
        updateLightbox(element);
    }    
}

//
//  Utilities
//

/**
 * Generate a random number from 0 to n.
 * @param {float} n - The highest number that can be generated. 
 * @returns {float} A random number from 0 to n. 
 * @memberof module:preciousGallery
 */
function random(n) {
    return Math.random() * n;
}

// Public API (exposed to the outside world).
return {

    /**
     * Init all Precious Galleries.
     * @memberof module:preciousGallery
     */
    initAll: function() {        
        initByClass("preciousGallery");    
    }
};

})();
