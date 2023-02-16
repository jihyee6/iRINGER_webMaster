type info = {
    name: string;
}

export default function SearchName({name}: info) {

    return <div className="search_name">{name}</div>

}