document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const clearButton = document.getElementById('clear');
    const dayCounter = document.getElementById('day-counter');

    const rows = 50;
    const cols = 50;
    let interval;
    let day = 0; // Compteur de jours
    let cells = Array(rows).fill(null).map(() => Array(cols).fill(false));

    // Création de la grille
    function createGrid() {
        grid.innerHTML = '';
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.addEventListener('click', () => toggleCell(r, c));
                grid.appendChild(cell);
            }
        }
    }

    // Changer l'état d'une cellule
    function toggleCell(r, c) {
        cells[r][c] = !cells[r][c];
        renderGrid();
    }

    // Mettre à jour la grille selon les règles du Jeu de la Vie
    function updateGrid() {
        const newCells = cells.map(row => row.slice());
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const aliveNeighbors = countAliveNeighbors(r, c);
                if (cells[r][c]) {
                    newCells[r][c] = aliveNeighbors === 2 || aliveNeighbors === 3;
                } else {
                    newCells[r][c] = aliveNeighbors === 3;
                }
            }
        }
        cells = newCells;
        renderGrid();
        updateDayCounter(); // Mettre à jour le compteur de jours
    }

    // Compter les voisins vivants d'une cellule
    function countAliveNeighbors(r, c) {
        const directions = [-1, 0, 1];
        let count = 0;
        directions.forEach(dRow => {
            directions.forEach(dCol => {
                if (dRow === 0 && dCol === 0) return;
                const newRow = r + dRow;
                const newCol = c + dCol;
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                    count += cells[newRow][newCol] ? 1 : 0;
                }
            });
        });
        return count;
    }

    // Rendre la grille selon l'état des cellules
    function renderGrid() {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = grid.children[r * cols + c];
                if (cells[r][c]) {
                    cell.classList.add('alive');
                } else {
                    cell.classList.remove('alive');
                }
            }
        }
    }

    // Mettre à jour le compteur de jours
    function updateDayCounter() {
        day++;
        dayCounter.textContent = `Jour : ${day}`;
    }

    // Démarrer la simulation
    function startSimulation() {
        interval = setInterval(updateGrid, 100);
        startButton.disabled = true;
        stopButton.disabled = false;
    }

    // Arrêter la simulation
    function stopSimulation() {
        clearInterval(interval);
        startButton.disabled = false;
        stopButton.disabled = true;
    }

    // Effacer la grille
    function clearGrid() {
        cells = Array(rows).fill(null).map(() => Array(cols).fill(false));
        renderGrid();
        stopSimulation();
        day = 0; // Réinitialiser le compteur de jours
        dayCounter.textContent = `Jour : ${day}`;
    }

    createGrid();

    startButton.addEventListener('click', startSimulation);
    stopButton.addEventListener('click', stopSimulation);
    clearButton.addEventListener('click', clearGrid);
});
