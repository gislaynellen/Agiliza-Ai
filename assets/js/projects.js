const Projects = {
    PROJECTS_KEY: 'agiliza_ai_projects',

    init: function() {
        this.renderProjects();
        
        const btnNew = document.getElementById('btnNewProject');
        if (btnNew) {
            btnNew.addEventListener('click', () => this.createNewProject());
        }
    },

    getUserProjects: function() {
        const user = Auth.getCurrentUser();
        if (!user) return [];

        const allProjects = JSON.parse(localStorage.getItem(this.PROJECTS_KEY) || '[]');
        return allProjects.filter(p => p.userId === user.id);
    },

    renderProjects: function() {
        const projects = this.getUserProjects();
        const grid = document.getElementById('projectsGrid');
        
        const existingCards = grid.querySelectorAll('.saved-project');
        existingCards.forEach(card => card.remove());

        projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card saved-project';
            card.innerHTML = `
                <div class="project-icon"><i class="fas fa-chart-pie"></i></div>
                <h3>${project.title}</h3>
                <div class="project-meta">
                    <span><i class="far fa-clock"></i> ${new Date(project.updatedAt).toLocaleDateString('pt-BR')}</span>
                    <i class="fas fa-arrow-right"></i>
                </div>
            `;
            
            card.addEventListener('click', () => {
                window.location.href = `canvas.html?id=${project.id}`;
            });

            grid.appendChild(card);
        });
    },

    createNewProject: function() {
        const user = Auth.getCurrentUser();
        if (!user) return;

        const newId = 'proj_' + Date.now();
        
        const newProject = {
            id: newId,
            userId: user.id,
            title: 'Novo Projeto',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            data: {} 
        };
        const allProjects = JSON.parse(localStorage.getItem(this.PROJECTS_KEY) || '[]');
        allProjects.push(newProject);
        localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(allProjects));

        window.location.href = `canvas.html?id=${newId}`;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('projectsGrid')) {
        Projects.init();
    }


document.addEventListener("DOMContentLoaded", () => {
    Auth.requireAuth();

    const user = Auth.getCurrentUser();
    const key = `projects_${user.id}`;
    const projects = JSON.parse(localStorage.getItem(key)) || [];

    const grid = document.getElementById("projectsGrid");

    projects.forEach(project => {
        const card = document.createElement("div");
        card.classList.add("project-card");
        card.dataset.id = project.id;

        card.innerHTML = `
            <h3>${project.title}</h3>
            <p>Atualizado em: ${new Date(project.updatedAt).toLocaleDateString("pt-BR")}</p>
        `;

        card.addEventListener("click", () => {
            localStorage.setItem("currentProjectId", project.id);
            window.location.href = "canvas.html"; // página do canvas
        });

        grid.appendChild(card);
    });
});

});