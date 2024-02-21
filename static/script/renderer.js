import { calculateAmount, scale, createSVGElement, removeElementById, generateGraph } from './utils.js'

export class Renderer {
    constructor() {
        this.loginForm()
        this.focusProject = {
            name: '',
            amount: 0
        }
    }
    loginForm() {
        const container = document.getElementById('container')
        container.innerHTML = `
        <form id="loginForm">
            <h2>Login</h2>
            <div id="error-msg"></div>
            <input type="text" name="credentials" placeholder="Username or Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" value="Login">Login</button>
        </form>
        `
    }

    removeLoginForm() {
        const loginForm = document.getElementById('loginForm')
        loginForm.remove()
    }

    init() {
        const auth = document.getElementById('auth');
        const logout = document.createElement('button');
        logout.id = 'logout';
        logout.textContent = 'Logout';
        auth.appendChild(logout);

        logout.addEventListener('click', () => {
            localStorage.setItem('token', '');
            window.location.reload();
        });

        this.removeLoginForm();
        const container = document.getElementById('container');
        const profileSection = document.createElement('section');
        const graphSection = document.createElement('section');
        profileSection.id = 'profile';
        graphSection.id = 'graphSection';
        container.style.width = '90%';

        const tabHeader = document.createElement('div');
        tabHeader.id = 'tabHeader';

        const createTab = (id, textContent) => {
            const tab = document.createElement('button');
            tab.className = 'tab';
            tab.id = id;
            tab.textContent = textContent;
            return tab;
        };

        const graph1Tab = createTab('graph1', 'XP by Time');
        const graph2Tab = createTab('graph2', 'Projects');
        const graph3Tab = createTab('graph3', 'Skills');

        graph1Tab.classList.add('active');

        tabHeader.appendChild(graph1Tab);
        tabHeader.appendChild(graph2Tab);
        tabHeader.appendChild(graph3Tab);

        graphSection.appendChild(tabHeader);
        container.appendChild(profileSection);
        container.appendChild(graphSection);
    }

    renderUser(user) {
        const profile = document.getElementById('profile');
        const userInfoContainer = document.createElement('div');
        userInfoContainer.id = 'userInfo';
        const rowT = document.createElement('div');
        const rowB = document.createElement('div');
        rowT.className = 'row';
        rowB.className = 'row';
        rowT.id = 'rowT';
        rowB.id = 'rowB';

        const name = document.createElement('h2');
        name.textContent = `${user.firstName} ${user.lastName}`;
        rowT.appendChild(name);

        const logDiv = document.createElement('div');
        logDiv.id = 'logDiv';
        const log = document.createElement('h4');
        log.textContent = "@" + user.login;
        const id = document.createElement('p');
        id.textContent = `#${user.id}`;
        logDiv.appendChild(log);
        logDiv.appendChild(id);
        rowT.appendChild(logDiv);

        const infoDiv = document.createElement('div');
        infoDiv.id = 'infoDiv';

        const email = document.createElement('p');
        email.textContent = `Email: ${user.email}`;
        const campus = document.createElement('p');
        campus.textContent = `Campus: ${user.campus}`;
        infoDiv.appendChild(email);
        infoDiv.appendChild(campus);
        rowT.appendChild(infoDiv);

        const xpDiv = document.createElement('div');
        xpDiv.id = 'xpDiv';
        const levelLabel = document.createElement('h4');
        levelLabel.textContent = 'Level';
        const level = document.createElement('h3');
        level.textContent = user.level;
        const xp = document.createElement('p');
        xp.textContent = `EXP: ${(Number(user.totalXp) / 1000000).toFixed(2)} MB`;
        xpDiv.appendChild(levelLabel);
        xpDiv.appendChild(level);
        xpDiv.appendChild(xp);
        rowB.appendChild(xpDiv);


        const auditDiv = document.createElement('div');
        auditDiv.id = 'auditDiv';
        const ratio = document.createElement('h4');
        ratio.textContent = `Ratio: ${Number(user.auditRatio).toFixed(1)}`;
        auditDiv.appendChild(ratio);

        const auditBox = document.createElement('div');
        auditBox.id = 'auditBox';
        const auditLabel = document.createElement('h3');
        auditLabel.textContent = 'Audit';
        auditBox.appendChild(auditLabel);
        const upDown = document.createElement('p');
        upDown.textContent = `Up: ${calculateAmount(user.totalUp)} | Down: ${calculateAmount(user.totalDown)}`;
        auditBox.appendChild(upDown);

        const graph = createSVGElement('svg', {
            id: 'graph',
            width: '100%',
            height: '40px'
        })

        const totalRatio = Number(user.totalUp) + Number(user.totalDown);
        const upPercentage = ((Number(user.totalUp) / totalRatio) * 100).toFixed(2);
        const downPercentage = ((Number(user.totalDown) / totalRatio) * 100).toFixed(2);

        const upBar = createSVGElement('rect', {
            x: '0',
            y: '0',
            width: `${upPercentage}%`,
            height: '20px',
            fill: '#00ff00'
        })
        graph.appendChild(upBar);


        const upText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        upText.setAttribute('x', '0');
        upText.setAttribute('y', '25%');
        upText.setAttribute('fill', '#000000');
        upText.textContent = `${calculateAmount(user.totalUp)}`;
        graph.appendChild(upText);

        const downBar = createSVGElement('rect', {
            x: '0',
            y: '50%',
            width: `${downPercentage}%`,
            height: '20px',
            fill: '#e00390',
        })
        graph.appendChild(downBar);

        const downText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        downText.setAttribute('x', '0');
        downText.setAttribute('y', '75%');
        downText.setAttribute('fill', '#000000');
        downText.textContent = `${calculateAmount(user.totalDown)}`;
        graph.appendChild(downText);

        auditBox.appendChild(graph);
        auditDiv.appendChild(auditBox);
        rowB.appendChild(auditDiv);
        userInfoContainer.appendChild(rowT);
        userInfoContainer.appendChild(rowB);
        profile.appendChild(userInfoContainer);
    }

    renderProjectsGraph(projects) {
        removeElementById('graphContainer')
        generateGraph('XP by Project')

        const maxValue = Math.max(...projects.map(project => project.amount))

        graphSection.appendChild(graphContainer)

        const graph = document.createElement('div')
        graph.id = 'graph'

        const projectGraph = createSVGElement('svg', {
            id: 'projectGraph',
            width: '100%',
            height: scale(maxValue, 0, maxValue)
        })


        const axisY = createSVGElement('line', {
            x1: '0',
            y1: '0',
            x2: '0',
            y2: '100%',
            stroke: 'black'
        })
        projectGraph.appendChild(axisY)

        const axisX = createSVGElement('line', {
            x1: '0',
            y1: '100%',
            x2: '100%',
            y2: '100%',
            stroke: 'black'
        })
        projectGraph.appendChild(axisX)

        for (let i = 0; i < 11; i++) {
            const line = createSVGElement('line', {
                x1: '0',
                y1: `${i * 100 / 10}%`,
                x2: '100%',
                y2: `${i * 100 / 10}%`,
                stroke: 'lightgray'
            })
            projectGraph.appendChild(line)

            const label = createSVGElement('text', {
                x: '2px',
                y: `${i * 100 / 10}%`,
                fill: 'black'
            })
            label.textContent = `${(maxValue / 10000) * (10 - i)} KB`
            projectGraph.appendChild(label)
        }

        projects.forEach((project, index) => {
            const dot = createSVGElement('circle', {
                cx: `${(index + 1) * 100 / projects.length}%`,
                cy: 600 - scale(project.amount, 0, maxValue),
                r: '5',
                fill: '#e00390'

            })
            projectGraph.appendChild(dot)


            dot.addEventListener('mouseover', () => {
                dot.setAttribute('r', '10')
                this.focusProject.name = project.path.split('/')[3].split('-').join(' ')
                this.focusProject.name = this.focusProject.name.charAt(0).toUpperCase() + this.focusProject.name.slice(1)
                this.focusProject.amount = project.amount
                dotLabel.textContent = `${this.focusProject.name} : ${calculateAmount(this.focusProject.amount)}`
            })

            dot.addEventListener('mouseout', () => {
                dot.setAttribute('r', '5')
                this.focusProject = {
                    name: '',
                    amount: 0
                }
                dotLabel.textContent = ''
            })
        })

        graph.appendChild(projectGraph)
        graphContainer.appendChild(graph)
    }

    renderXpByTimeGraph(xpByTime) {
        removeElementById('graphContainer');
        generateGraph('XP by Time');
        const graph = document.createElement('div');
        graph.id = 'graph';

        const timeGraph = createSVGElement('svg', {
            id: 'timeGraph',
            width: '100%',
            height: '600'
        });

        const axisY = createSVGElement('line', {
            x1: '0',
            y1: '0',
            x2: '0',
            y2: '100%',
            stroke: 'black'
        });
        timeGraph.appendChild(axisY);

        const axisX = createSVGElement('line', {
            x1: '0',
            y1: '100%',
            x2: '100%',
            y2: '100%',
            stroke: 'black'
        });
        timeGraph.appendChild(axisX);

        const totalDays = Math.floor((Date.now() - new Date(xpByTime[0].createdAt)) / 86400000);
        let totalXp = 0;

        const timeline = [];
        timeline.push({ date: new Date('Mon May 22 2023').toDateString(), amount: 0 });
        timeline.push({ date: new Date('Tue May 23 2023').toDateString(), amount: 0 });
        for (let i = 0; i <= totalDays; i++) {
            const day = new Date(xpByTime[0].createdAt);
            day.setDate(day.getDate() + i);
            const dayXp = xpByTime.filter(xp => new Date(xp.createdAt).toDateString() === day.toDateString());
            const dayTotalXp = dayXp.reduce((acc, xp) => acc + xp.amount, 0);
            totalXp += dayTotalXp;
            timeline.push({ date: day.toDateString(), amount: totalXp });
        }

        const containerWidth = graphContainer.clientWidth;
        const maxValue = Math.max(...timeline.map(day => day.amount));
        const points = timeline
            .map((day, index) => `${(index / totalDays) * containerWidth},${600 - scale(day.amount, 0, maxValue)}`)
            .join(' ');

        const graphLine = createSVGElement('polyline', {
            points: points,
            fill: 'none',
            stroke: 'lightgray',
            'stroke-width': '3'
        });
        timeGraph.appendChild(graphLine);

        for (let i = 0; i < 11; i++) {
            const line = createSVGElement('line', {
                x1: '0',
                y1: `${(i * 100) / 10}%`,
                x2: '100%',
                y2: `${(i * 100) / 10}%`,
                stroke: 'lightgray'
            });
            timeGraph.appendChild(line);

            const label = createSVGElement('text', {
                x: '2px',
                y: `${(i * 100) / 10}%`,
                fill: 'black'
            });
            label.textContent = `${calculateAmount((maxValue / 10) * (10 - i))}`;
            timeGraph.appendChild(label);
        }

        let prevDayXp = 0;
        timeline.forEach((day, index) => {
            if (prevDayXp != day.amount) {
                const dot = createSVGElement('circle', {
                    cx: `${(index / totalDays) * containerWidth}`,
                    cy: 600 - scale(day.amount, 0, maxValue),
                    r: '2',
                    fill: '#e00390'
                });
                timeGraph.appendChild(dot);
                prevDayXp = day.amount;

                dot.addEventListener('mouseover', () => {
                    dot.setAttribute('r', '10');
                    dotLabel.textContent = `${day.date} : ${calculateAmount(day.amount - timeline[index - 1].amount)}`;
                });

                dot.addEventListener('mouseout', () => {
                    dot.setAttribute('r', '2');
                    this.focusProject.name = '';
                    this.focusProject.amount = 0;
                    dotLabel.textContent = '';
                });
            }
        });

 

        graph.appendChild(timeGraph);
        graphContainer.appendChild(graph);
    }

    renderSkillsGraph(skills) {
        removeElementById('graphContainer');
        generateGraph('Skills (in %)');

        const graph = document.createElement('div');
        graph.id = 'graph';

        const containerWidth = graphContainer.clientWidth;
        const totalGraphHeight = 600;

        const skillGraph = createSVGElement('svg', {
            id: 'skillGraph',
            width: containerWidth,
            height: '600'
        });

        const axisY = createSVGElement('line', {
            x1: '0',
            y1: '0',
            x2: '0',
            y2: '100%',
            stroke: 'black'
        });
        skillGraph.appendChild(axisY);

        const axisX = createSVGElement('line', {
            x1: '0',
            y1: '100%',
            x2: '100%',
            y2: '100%',
            stroke: 'black'
        });
        skillGraph.appendChild(axisX);

        const yLabels = [0, 25, 50, 75, 100].reverse();
        yLabels.forEach((label, index) => {
            const text = createSVGElement('text', {
                x: '-20',
                y: `${(index / 4) * totalGraphHeight}`,
                fill: 'black'
            });
            text.textContent = `${label}`;

            const line = createSVGElement('line', {
                x1: '0',
                y1: `${(index / 4) * totalGraphHeight}`,
                x2: '100%',
                y2: `${(index / 4) * totalGraphHeight}`,
                stroke: 'lightgray'
            });

            skillGraph.appendChild(text);
            skillGraph.appendChild(line);
        });

        const skillsArray = Object.entries(skills);

        skillsArray.forEach((skill, index) => {
            const bar = createSVGElement('rect', {
                x: `${(index / skillsArray.length) * containerWidth}`,
                y: totalGraphHeight - (skill[1] / 100) * totalGraphHeight,
                width: `${containerWidth / skillsArray.length - 2}`,
                height: (skill[1] / 100) * totalGraphHeight,
                fill: '#e00390'
            });
            skillGraph.appendChild(bar);
        });

        const labels = skillsArray.map((skill, index) => {
            const barWidth = containerWidth / skillsArray.length - 2;
            const barHeight = (skill[1] / 100) * totalGraphHeight;
            const barX = (index / skillsArray.length) * containerWidth;
            const barY = totalGraphHeight - barHeight;
            const centerX = barX + barWidth / 2;
            const centerY = barY + barHeight / 2;

            const label = createSVGElement('text', {
                x: `${centerX}`,
                y: `${centerY}`,
                fill: 'white',
                'text-anchor': 'middle',
                'dominant-baseline': 'middle',
                transform: `rotate(-90, ${centerX}, ${centerY}) translate(0, 0)`
            });
            label.textContent = skill[0];
            return label;
        });

        labels.forEach(label => skillGraph.appendChild(label));

        graph.appendChild(skillGraph);
        graphContainer.appendChild(graph);
    }
}
