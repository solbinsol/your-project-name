import Link from "next/link";
import styles from "../../pages/listpage/styles/ListPageCss.module.css";
const ListItem = ({ EnName,thumbnail,webtoonName, ep /*uploadDate*/, handleClick }) => {

  function MovePage(){
    console.log("SS")
    window.location.href=`/webtoonpage?EnName=${EnName}&ep=${encodeURIComponent(ep)}`
  }
  return (
    <>      
      <div className={styles.ListItem} onClick={MovePage}>
        <div className={styles.ListImg}>
          <img src={thumbnail} alt={thumbnail} />
        </div>
        <div className={styles.ListItemContent}>
          <p className={styles.Episode}>
            {webtoonName} <br />
            <span className={styles.tab}>{ep}화</span>
          </p>
          <p className={styles.SU}>
            {/* <span className="tab">{uploadDate}</span> */}
          </p>
        </div>
      </div>
      <div className={styles.dn}></div>
      </>

  );
};

export default ListItem;
