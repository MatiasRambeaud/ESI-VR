import {collection, getdocs } from "firebase/firestore";

const col = collection(db, "Nombres");
const snap = await getdocs(col)
const data = snap.docs.map (d=> ({ id: d.id, ...d.data()}));
console.log(data);