export class User {
    constructor() {
        this.id = null;
        this.login = null;
        this.email = null;
        this.firstName = null;
        this.lastName = null;
        this.campus = null;
        this.totalXp = null;
        this.level = null;
        this.totalUp = null;
        this.totalDown = null;
        this.auditRatio = null;

        this.skills = null;
    }

    _makeQuery = async (query) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Not authenticated');
        }
        const response = await fetch('https://zone01normandie.org/api/graphql-engine/v1/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': 'Bearer ' + token
            },
            body: JSON.stringify({ query })
        });
        return await response.json();
    }

    getBasicInfo = async () => {
        const query = `query{
            user {
                id
                firstName
                lastName
                totalUp
                totalDown
                campus
                email
                login
                auditRatio
                events(where: {event: {path: {_ilike:"%div-01"}}}) {
                level
                }
                transactions_aggregate(
                    where: {event: {path: {_ilike: "/rouen/div-01"}}, _and: {type: {_eq: "xp"}}}
                ) {
                aggregate {
                    sum {
                        amount
                    }
                    }
                }
            }
        }`
        const userInfo = await this._makeQuery(query)
        this.id = userInfo.data.user[0].id
        this.login = userInfo.data.user[0].login
        this.email = userInfo.data.user[0].email
        this.firstName = userInfo.data.user[0].firstName
        this.lastName = userInfo.data.user[0].lastName
        this.campus = userInfo.data.user[0].campus
        this.totalXp = userInfo.data.user[0].transactions_aggregate.aggregate.sum.amount
        this.level = userInfo.data.user[0].events[0].level
        this.totalUp = userInfo.data.user[0].totalUp
        this.totalDown = userInfo.data.user[0].totalDown
        this.auditRatio = userInfo.data.user[0].auditRatio
    }

    getSkills = async () => {
        const query = `query{
            transaction(
                where: {
                    userId : {_eq : ${this.id}},
                    type: {_ilike: "skill_%"}
                }, 
                order_by : {amount : desc}
            ) { 
                type,
                amount,
            }
        }`
        const skills = await this._makeQuery(query)

        this.skills = skills.data.transaction.reduce((acc, skill) => {
            const skillName = skill.type.split('_')[1]
            if (!acc[skillName]) {
                acc[skillName] = skill.amount
            }
            return acc
        },{})
        return this.skills
    }

    getXpByTime = async () => {
        const query = `query{
            user {
                transactions(
                    where: {event: {path: {_ilike: "/rouen/div-01"}}, type: {_eq: "xp"}}
                    order_by: {createdAt: asc}
                ) {
                    amount
                    createdAt
                }
            }
        }`
        const xp = await this._makeQuery(query)
        return xp.data.user[0].transactions
    }

    getXpByProject = async () => {
        const query = `query{
            user {
                transactions(
                    where: {event: {path: {_ilike: "/rouen/div-01"}}, object: {type: {_eq: "project"}}, type: {_eq: "xp"}}
                    order_by: {createdAt: asc}
                ) {
                    amount
                    path
                }
            }
        }`
        const projects = await this._makeQuery(query)
        return projects.data.user[0].transactions
    }
}
