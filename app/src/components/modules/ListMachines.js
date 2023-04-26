import Style from "../../css/components/machine.module.css";

import useFetch from "../../hooks/useFetch";

import Machine from "./Machine";

const ListMachines = () => {
  const { data, isFetching } = useFetch("/room/components/machines");
  const machines = []
  if(!isFetching){
    for (const mac in data) {
      machines.push(mac)
    }
  }
  return (
    <section className={Style.section}>
    <h6>Máquinas</h6>
    <div className={Style.ListMachine}>
      {!isFetching && machines.map((item, index)=>{
        return <Machine key={index} id={item} />
      })}
    </div>
    </section>
  );
};

export default ListMachines;
