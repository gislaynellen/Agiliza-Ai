const Canvas = {
    currentProjectId: null,
    PROJECTS_KEY: 'agiliza_ai_projects',

    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentProjectId = urlParams.get('id');

        if (!this.currentProjectId) {
            alert('Erro: Nenhum projeto selecionado. Redirecionando...');
            window.location.href = 'projects.html';
            return;
        }

        this.loadProjectData();
    },

    loadProjectData: function() {
        const allProjects = JSON.parse(localStorage.getItem(this.PROJECTS_KEY) || '[]');
        const project = allProjects.find(p => p.id === this.currentProjectId);

        if (project) {
            const titleInput = document.querySelector('.project-title');
            if (titleInput) {
                titleInput.value = project.title;
            }
            console.log('Projeto carregado:', project.title);
        } else {
            alert('Projeto não encontrado!');
            window.location.href = 'projects.html';
        }
    },

    saveProject: function() {
        const title = document.querySelector('.project-title').value;
        
        const allProjects = JSON.parse(localStorage.getItem(Canvas.PROJECTS_KEY) || '[]');
        const projectIndex = allProjects.findIndex(p => p.id === Canvas.currentProjectId);

        if (projectIndex !== -1) {
            allProjects[projectIndex].title = title;
            allProjects[projectIndex].updatedAt = new Date().toISOString();
            
            localStorage.setItem(Canvas.PROJECTS_KEY, JSON.stringify(allProjects));
            alert('Projeto salvo com sucesso!');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Canvas.init();

    const saveBtn = document.querySelector('.btn-secondary'); 
    if(saveBtn) {
        saveBtn.addEventListener('click', () => Canvas.saveProject());
    }
});