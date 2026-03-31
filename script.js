const workspace = document.getElementById('workspace');
const overlay = document.getElementById('guide-overlay');
const okBtn = document.getElementById('ok-btn');
let proxy = null;
let targetUrl = "";

//  Highlights the navpill that the page is on.
const currentPath = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll('.nav-pill').forEach(pill => {
    if (pill.getAttribute('data-target') === currentPath) {
        pill.classList.add('active-page');
    }
});

//  Makes hte pop up only pop up once and hides it on click.
if (overlay && okBtn) {
    if (sessionStorage.getItem('guideSeen') !== 'true') {
        overlay.style.display = 'flex';
    } else {
        overlay.classList.add('hidden');
    }

    okBtn.onclick = () => {
        overlay.style.opacity = '0';
        sessionStorage.setItem('guideSeen', 'true');
        setTimeout(() => {
            overlay.classList.add('hidden');
            overlay.style.display = 'none';
        }, 500);
    };
}
// How dragging the pills works. it creates a fake element that the user drags and once dropped in the big square it goes to that page. Your basically just dragging a link to a box.
document.querySelectorAll('.nav-pill').forEach(pill => {
    pill.onmousedown = (e) => {

        if (overlay && !overlay.classList.contains('hidden')) return;

        targetUrl = pill.getAttribute('data-target');
        proxy = document.createElement('div');
        proxy.className = 'proxy';
        proxy.innerText = pill.innerText;
        document.body.appendChild(proxy);
        
        moveProxy(e.clientX, e.clientY);
        pill.style.opacity = "0.2";
    };
});

window.onmousemove = (e) => {
    if (!proxy) return;
    moveProxy(e.clientX, e.clientY);
    
    const rect = workspace.getBoundingClientRect();
    if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
        workspace.classList.add('drag-over');
    } else {
        workspace.classList.remove('drag-over');
    }
};

window.onmouseup = (e) => {
    if (!proxy) return;
    const rect = workspace.getBoundingClientRect();
    
    if (e.clientX > rect.left && e.clientX < rect.right && e.clientY > rect.top && e.clientY < rect.bottom) {
        workspace.style.background = "var(--accent)";
        const status = document.getElementById('status');
        if (status) {
            status.innerText = "LOADING...";
            status.style.color = "#000";
            status.style.opacity = "1";
        }
        setTimeout(() => { window.location.href = targetUrl; }, 150);
    }
    
    document.querySelectorAll('.nav-pill').forEach(p => p.style.opacity = "1");
    proxy.remove();
    proxy = null;
    workspace.classList.remove('drag-over');
};

function moveProxy(x, y) {
    if (proxy) {
        proxy.style.left = (x - proxy.offsetWidth / 2) + 'px';
        proxy.style.top = (y - proxy.offsetHeight / 2) + 'px';
    }
}
