import { useEffect, useState } from "react";
import { IContact } from "./types";

export default function ContactBook() {
    const [contacts, setContacts] = useState<IContact[]>([]);

    const getContacts = async () => {
        const url = "http://localhost:3000/api/projects/1/kv";
        const { all } = await fetch(url).then(res => res.json());
        const contacts = Object.entries(all).map(([name, phone]) => ({
            name,
            phone,
        })) as IContact[];
        setContacts(contacts);
    };

    const initDb = async () => {
        const url = "http://localhost:3000/api/projects/1/kv";
        await fetch(url, { method: "POST" });
    };

    useEffect(() => {
        initDb().then(() => getContacts());
    }, []);

    const uploadContact = async (contact: IContact) => {
        const url = "http://localhost:3000/api/projects/1/kv";
        console.log(contact);
        await fetch(url, {
            method: "PUT",
            body: JSON.stringify({
                key: contact.name,
                val: contact.phone,
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        getContacts();
    };

    return (
        <div>
            <h1>Contact Book</h1>
            <ContactForm addContact={uploadContact} />
            {contacts.map((contact, idx) => (
                <Contact key={idx} contact={contact} />
            ))}
        </div>
    );
}

function Contact({ contact }: { contact: IContact }) {
    return (
        <div>
            <b>{contact.name}</b>
            <p>{contact.phone}</p>
        </div>
    );
}

function ContactForm({ addContact }: { addContact: (contact: IContact) => void }) {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addContact({ name, phone });
        setName("");
        setPhone("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
            />
            <button type="submit">Add Contact</button>
        </form>
    );
}
