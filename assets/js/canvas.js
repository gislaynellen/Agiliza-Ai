const Canvas = {
    init: function() {
        console.log('Canvas inicializado');
    },

    saveProject: function() {
        const title = document.querySelector('.project-title').value;
        alert(`Projeto "${title}" salvo localmente! (Simulação)`);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Canvas.init();

    const saveBtn = document.querySelector('.btn-secondary i.fa-save');
    if(saveBtn) {
        saveBtn.parentElement.addEventListener('click', Canvas.saveProject);
    }
});
