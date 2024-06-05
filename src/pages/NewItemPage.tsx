import ItemForm from '../components/ItemForm';

const NewItemPage = () => {

    return <div className="flex flex-col border h-max ml-10">
        <h1>New Item</h1>
        <ItemForm readOnly={false}/>
    </div>
}

export default NewItemPage;