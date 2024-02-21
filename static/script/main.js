import { LoginForm } from './auth.js'
import { Renderer } from './renderer.js'
import { User } from './user.js'


const renderer = new Renderer()
new LoginForm()

if (localStorage.getItem('token')) {
    renderer.init()
    const user = new User()
    await user.getBasicInfo()
    const xp = await user.getXpByTime()
    const projects = await user.getXpByProject()
    const skills = await user.getSkills()

    renderer.renderUser(user)
    
    const graph1Tab = document.getElementById('graph1')
    const graph2Tab = document.getElementById('graph2')
    const graph3Tab = document.getElementById('graph3')
    if (graph1Tab.classList.contains('active')) {
        renderer.renderXpByTimeGraph(xp)
    }

     for (const tab of [graph1Tab, graph2Tab, graph3Tab]) {
        tab.addEventListener('click', (e) => {
            e.preventDefault()
            for (const tab of [graph1Tab, graph2Tab, graph3Tab]) {
                tab.classList.remove('active')
            }
            tab.classList.add('active')
            switch (true) {
                case graph1Tab.classList.contains('active'):
                    renderer.renderXpByTimeGraph(xp)
                    break
                case graph2Tab.classList.contains('active'):
                    renderer.renderProjectsGraph(projects)
                    break
                case graph3Tab.classList.contains('active'):
                    renderer.renderSkillsGraph(skills)
                    break
            }
        })
     }

    window.addEventListener('resize', () => { 
        switch (true) {
            case graph1Tab.classList.contains('active'):
                renderer.renderXpByTimeGraph(xp)
                break
            case graph2Tab.classList.contains('active'):
                renderer.renderProjectsGraph(projects)
                break
            case graph3Tab.classList.contains('active'):
                renderer.renderSkillsGraph(skills)
                break
        }
    })

}