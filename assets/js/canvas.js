const Canvas = {
    currentProjectId: null,
    PROJECTS_KEY: 'agiliza_ai_projects',

    init: function () {
        const urlParams = new URLSearchParams(window.location.search);
        this.currentProjectId = urlParams.get('id');

        if (!this.currentProjectId) {
            alert("Erro: Nenhum projeto selecionado.");
            window.location.href = "projects.html";
            return;
        }

        this.loadProjectData();
        document.getElementById("btnSaveProject").addEventListener("click", () => this.saveProject());
    },

    loadProjectData: function () {
        const allProjects = JSON.parse(localStorage.getItem(this.PROJECTS_KEY) || "[]");
        const project = allProjects.find(p => p.id === this.currentProjectId);

        if (!project) {
            alert("Projeto não encontrado.");
            window.location.href = "projects.html";
            return;
        }

        // Título
        const titleInput = document.querySelector(".project-title");
        if (titleInput) titleInput.value = project.title;

        // Quadros
        const blocks = document.querySelectorAll(".canvas-block");
        blocks.forEach(block => {
            const title = block.querySelector(".block-header").innerText.trim();
            block.querySelector(".block-content").innerText = project.data?.[title] || "";
        });

        console.log("Projeto carregado:", project);
    },

    getCanvasData: function () {
        const blocks = document.querySelectorAll(".canvas-block");
        let data = {};

        blocks.forEach(block => {
            const title = block.querySelector(".block-header").innerText.trim();
            const content = block.querySelector(".block-content").innerText.trim();
            data[title] = content;
        });

        return data;
    },

    saveProject: function () {
        const title = document.querySelector(".project-title").value.trim() || "Projeto sem título";
        const data = this.getCanvasData();

        const allProjects = JSON.parse(localStorage.getItem(this.PROJECTS_KEY) || "[]");
        const index = allProjects.findIndex(p => p.id === this.currentProjectId);

        if (index !== -1) {
            allProjects[index].title = title;
            allProjects[index].updatedAt = new Date().toISOString();
            allProjects[index].data = data;
        }

        localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(allProjects));

        alert("Projeto salvo!");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    Canvas.init();
});
