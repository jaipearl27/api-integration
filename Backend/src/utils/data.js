const db = []


export const addData = (data) => {
    let row = {id: db[db.length - 1]?.id || 0, ...data}
    db.push(row)
}


export const removeData = (id) => {

}