export default function Header() {
    const name = localStorage.getItem('name')
    const role = localStorage.getItem('role')

    return (
        <div className="bg-white flex flex-row border-b-2 border-[#e2e2e2] justify-end h-12.5">

            <div>
                <h1>{name}</h1>
                <h2>{role}</h2>


            </div>

            <div className="bg-blue-500">
                <h2>img placeholder for  now</h2>
            </div>


        </div>
    )
}