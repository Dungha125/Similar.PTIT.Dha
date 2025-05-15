import {useNavigate, useSearchParams} from "react-router-dom";
import DuckIcon from "duckicon";

const Pagination = ({limit, total, currentPage, handleSetPage}) => {
    var indents = [];


    for (let i = 0; i < total; i++) {
        indents.push(
            i + 1 === currentPage ?
                <li><a className="pagination-link is-current " aria-label="Goto page">{i + 1}</a></li> :
                <li><a onClick={() => handleSetPage(i + 1)} className="pagination-link title-s" aria-label="Goto page">{i + 1}</a>
                </li>
        )
    }
    return <nav className="pagination cursor-pointer" role="navigation" aria-label="pagination">
        <div className="pag-left"> 1-{limit} of {currentPage}</div>
        <div className="pag-right">
            <ul className="pagination-list">
                {indents}
            </ul>
            {currentPage === 1 ? <a className="pagination-previous is-disabled">
                    <DuckIcon icon={"arrow-left"}></DuckIcon>
                </a>
                :
                <a onClick={() => handleSetPage(parseInt(currentPage - 1))} className="pagination-previous"></a>}
            {currentPage === total ?
                <a className="pagination-previous is-disabled"><DuckIcon icon={"arrow-right "}/></a> :
                <a onClick={() => handleSetPage(parseInt(currentPage - (-1)))} className="pagination-next"><DuckIcon
                    icon={"arrow-right "}/> </a>}
        </div>


    </nav>
}
export default Pagination