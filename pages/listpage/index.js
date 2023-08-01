import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../../src/Header/header";
import style from "./styles/ListPageCss.module.css";
import Footer from "../../src/Footer/footer";
import ListItem from "../../src/Component/listitem";
import Head from "next/head";
import Link from "next/link";

const ListPage = () => {
  const router = useRouter();
  const { EnName } = router.query;
  const [webtoonInfo, setWebtoonInfo] = useState({});
  const [webtoonItem, setWebtoonItem] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ep, setEp] = useState(1);
  const [ascSort, setAscSort] = useState(false); // 오름차순 여부
  const [descSort, setDescSort] = useState(false); // 내림차순 여부

  function MovePage() {
    window.location.href = `/webtoonpage?EnName=${EnName}&ep=1`;
  }

  const getTokenFromLocalStorage = () => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem("token");
    }
    return null;
  };

  useEffect(() => {
    if (EnName) {
      fetchData();
    }
  }, [EnName]);

  const fetchData = async () => {
    try {
      if (EnName) {
        const [infoResponse, itemResponse] = await Promise.all([
          fetch(`/api/listinfo?EnName=${encodeURIComponent(EnName)}`, {
            cache: "no-store",
          }),
          fetch(`/api/listitem?EnName=${encodeURIComponent(EnName)}`),
        ]);

        const { webtoonData } = await infoResponse.json();
        setWebtoonInfo(webtoonData[0]);

        const { webtoonData: itemData } = await itemResponse.json();
        setWebtoonItem(itemData);
      } else {
        setWebtoonInfo(null);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching API:", error);
      setLoading(false);
    }
  };

  const handleItemClick = () => {
    handleClick(ep);
    window.location.href = `/webtoonpage?EnName=${EnName}&ep=${ep}`;
  };

  if (!webtoonItem) {
    return "no data"; // 로딩 중이거나 데이터가 없을 때 null을 반환하여 아무 내용도 표시하지 않습니다.
  }

  const isTokenValid = () => {
    const token = getTokenFromLocalStorage();
    // 토큰이 존재하면 유효한 것으로 간주합니다.
    return !!token;
  };

  // 좋아요 버튼을 클릭했을 때 처리하는 handleLike 함수
  const handleLike = async () => {
    const tokenExists = isTokenValid();

    if (tokenExists) {
      const userEmail = sessionStorage.getItem("userEmail");
      console.log(EnName, userEmail + "102line");

      try {
        const response = await fetch("/api/update_like", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            EnName: EnName,
            UserEmail: userEmail,
          }),
        });
        const data = await response.json();
        console.log(data);
        if (data === "0") {
          setWebtoonInfo((prevInfo) => ({
            ...prevInfo,
            like: prevInfo.like + 1,
          }));
          window.alert("like up");
        } else if (data === "1") {
          setWebtoonInfo((prevInfo) => ({
            ...prevInfo,
            like: prevInfo.like - 1,
          }));
          window.alert("like cancel");
        } else {
          console.error("좋아요 추가 실패:", response);
          window.alert("좋아요 추가 실패!");
        }
      } catch (error) {
        console.error("좋아요 추가 오류:", error);
      }
    } else {
      window.alert("로그인 후 이용 가능합니다 !");
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleEpChange = (ep) => {
    setEp(ep);
  };

  const webtoonsPerPage = 8;
  const totalWebtoons = webtoonItem.length;
  const totalPages = Math.ceil(totalWebtoons / webtoonsPerPage);

  const handleAscSort = () => {
    if (!ascSort) {
      setAscSort(true);
      setDescSort(false);
      // webtoonItem을 오름차순으로 정렬
      setWebtoonItem((prevItems) => prevItems.slice().sort((a, b) => a.episode_number - b.episode_number));
    }
  };

  const handleDescSort = () => {
    if (!descSort) {
      setDescSort(true);
      setAscSort(false);
      // webtoonItem을 내림차순으로 정렬
      setWebtoonItem((prevItems) => prevItems.slice().sort((a, b) => b.episode_number - a.episode_number));
    }
  };

  let KrDay = "";

  if (webtoonInfo && webtoonInfo.week) {
    if (webtoonInfo.week === "mon") {
      KrDay = "월";
    } else if (webtoonInfo.week === "tues") {
      KrDay = "화";
    } else if (webtoonInfo.week === "wendes") {
      KrDay = "수";
    } else if (webtoonInfo.week === "thurs") {
      KrDay = "목";
    } else if (webtoonInfo.week === "fri") {
      KrDay = "금";
    } else if (webtoonInfo.week === "satur") {
      KrDay = "토";
    } else if (webtoonInfo.week === "sun") {
      KrDay = "일";
    }
  } else {
    KrDay = "알 수 없음";
  }

  return (
    <div className={style.ListPage}>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#317EFB" />
        <meta name="name" content="#317EFB" />
      </Head>

      <Header />

      <div className={style.ListInfoBox}>
        {webtoonInfo && (
          <div className={style.ListInfo}>
            <div className={style.ListImgBox}>
              <img src={webtoonInfo.thumbnail} alt={webtoonInfo.webtoon_name} />
            </div>

            <div className={style.ListInfo}>
              <div className={style.TextBox}>
                <>
                  <p id="line" className={style.tab2}>
                    {webtoonInfo.webtoon_name}
                  </p>
                  <p id={style.line} className={style.GrayP}>
                    글/그림<span>{webtoonInfo.author}</span> | {KrDay} 요웹툰
                    <br />
                    {webtoonInfo.content}
                    <div className={style.InfoBtn}>
                      <button id={style.PointBtn} className={style.IBtn} onClick={handleLike}>
                        좋아요 {webtoonInfo.like}
                      </button>
                      <button onClick={MovePage} className={style.IBtn}>첫화보기 1화</button>
                      <button className={style.SNSBTN}>공유하기</button>
                    </div>
                  </p>
                </>
              </div>
            </div>
          </div>
        )}
      </div>

      {!webtoonItem ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className={style.ListBox}>
            <div className={style.DESC}>
              <span onClick={handleAscSort}>오름차순 /</span><span onClick={handleDescSort}> 내림차순</span>
            </div>
            <ul className={style.List}>
              {webtoonItem.map((item) => (
                <li key={item.episode_number}>
                  <ListItem
                    EnName={EnName}
                    thumbnail={item.episode_thumbnail}
                    webtoonName={item.webtoon_name}
                    ep={item.episode_number}
                    uploadDate={item.update}
                    handleClick={handleEpChange}
                  />
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <div className={style.Pagination}>
        <span className={style.Arrow}>{"<"}</span>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? `${style.active}` : ""}
          >
            {index + 1}
          </button>
        ))}
        <span className={style.arrow}>{">"}</span>
      </div>

      <Footer />
      <div className={style.dn}></div>
    </div>
  );
};

export default ListPage;
