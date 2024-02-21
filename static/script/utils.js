export const calculateAmount = (amount) => {
    if (amount < 1000) {
        return `${amount} B`
    }
    if (amount < 1000000) {
        if (amount < 10000) {
            return `${(amount / 1000).toFixed(2)} KB`
        }
        return `${(amount / 1000).toFixed(1)} KB`
    }
    return `${(amount / 1000000).toFixed(2)} MB`
}

export const scale = (value, min, max) => {
    const graphHeight = 600
    return (value - min) / (max - min) * graphHeight
}

export const createSVGElement = (tag, att) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tag)
    for (const key in att) {
        element.setAttribute(key, att[key])
    }
    return element
}

export const removeElementById = (id) => {
    const element = document.getElementById(id)
    if (element) {
        element.remove()
    }
}

export const generateGraph = (title) => {
    const graphSection = document.getElementById('graphSection')
    const graphContainer = document.createElement('div')
    graphContainer.id = 'graphContainer'
    const graphTitle = document.createElement('h2')
    graphTitle.textContent = title
    const dotLabel = document.createElement('div')
    dotLabel.id = 'dotLabel'
    graphContainer.appendChild(graphTitle)
    graphContainer.appendChild(dotLabel)
    graphSection.appendChild(graphContainer)
}