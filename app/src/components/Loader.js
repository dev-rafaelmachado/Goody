import Style from "../css/components/loader.module.css"

const Loader = () => {
  return (
    <div className={Style.wrapper}>
      <div className={Style.circle}></div>
      <div className={Style.circle}></div>
      <div className={Style.circle}></div>
      <div className={Style.shadow}></div>
      <div className={Style.shadow}></div>
      <div className={Style.shadow}></div>
    </div>
  );
};

export default Loader;
