
const StatisticCard = ({ title, value, description }) => {
    return (
        <div className="col border card">
            <div className={"p-l"}>
                <div className="title-xl font-bold">{value}</div>
                <p className="text-m text-disable">{title}</p>
                {description && (
                    <p className="text-disable">{description}</p>
                )}
            </div>
        </div>
    );
};

export default StatisticCard;
