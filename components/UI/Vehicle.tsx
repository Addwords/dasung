import { Button } from "primereact/button";
import { InputNumber } from "primereact/inputnumber";
import { useEffect, useState } from "react";

const Vehicle = (props:any) =>{

  const vehicleNm = props.name;
  const [vehicleSize, setVehicleSize] = useState(16);

  const handler = (e:any)=>{
    console.log('value:',vehicleSize);
    props.callback && props.callback(props.type, vehicleSize);
  };

  useEffect(()=>{
	console.log('props.value:',props.value)
    setVehicleSize(props.value);
  },[]);

	return ( 
		  <div className={props.class}>
					<div className="card mb-0">
						<div className="flex justify-content-between mb-3">
							<div>
								<span className="block text-500 font-semibold mb-3">{vehicleNm}</span>
								<div className="text-900 font-medium text-xl">
									<div className="p-inputgroup">
										<InputNumber
											inputClassName="font-semibold pt-2 pb-2 pr-1 text-xl"
											className="w-auto"
											size={2}
											value={vehicleSize}
											onValueChange={(e)=>{setVehicleSize(Number(e.value))}}
											mode="decimal"
										/>
										<p className="pl-1 pt-2">m<sup>3</sup></p>
										<Button className="ml-3 mt-2" style={{ height: '2.2rem' }} label="save" icon="pi pi-check"
											onClick={handler} />
									</div>
								</div>
							</div>
							<div className={`flex align-items-center justify-content-center ${props.backColor} border-round`} style={{ width: '2.5rem', height: '2.5rem' }}>
								<i className={`pi pi-car ${props.color} text-xl`} />
							</div>
						</div>
						{/* <span className="text-green-500 font-medium">24 new </span>
						<span className="text-500">since last visit</span> */}
					</div>
				</div>
	 );
}

export default Vehicle;