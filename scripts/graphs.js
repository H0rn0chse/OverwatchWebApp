function PieChart (data, width) {
	const height = width;
	const radius = Math.min(width, height) / 2 * 0.8;

	const pie = d3.pie()
		.sort(null)
		.value(d => d.value);	
	const arc = d3.arc()
		.innerRadius(0)
		.outerRadius(Math.min(width, height) / 2 - 1)
	const arcLabel = d3.arc()
		.innerRadius(radius)
		.outerRadius(radius);

	const arcs = pie(data);

	const svg = d3.create("svg")
		.attr("viewBox", [-width / 2, -height / 2, width, height]);

	svg.append("g")
			.attr("stroke", "white")
		.selectAll("path")
		.data(arcs)
		.join("path")
			.attr("fill", d => d3.rgb(d.data.color))
			.attr("d", arc)
		.append("title")
			.text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);
  
	svg.append("g")
			.attr("font-family", "sans-serif")
			.attr("font-size", 8)
			.attr("text-anchor", "middle")
		.selectAll("text")
		.data(arcs)
		.join("text")
			.attr("transform", d => `translate(${arcLabel.centroid(d)})`)
			.call(text => text.append("tspan")
				.attr("y", "-0.4em")
				.attr("font-weight", "bold")
				.text(d => d.data.name))
			.call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
				.attr("x", 0)
				.attr("y", "0.7em")
				.attr("fill-opacity", 0.7)
				.text(d => d.data.value.toLocaleString()));
  
	return svg.node();
}

function GroupedBarChart (data, midpoint, width, height) {
	const margin = ({top: 10, right: 10, bottom: 20, left: 40})

	const groupKey = data.columns[0];
	const keys = data.columns.slice(1);
	const fontColor = getComputedStyle(document.body).getPropertyValue('--color');
	const backgroundColor = getComputedStyle(document.body).getPropertyValue('--background');

	legend = svg => {
		const g = svg
				.attr("transform", `translate(${width},0)`)
				.attr("text-anchor", "end")
				.attr("font-family", "sans-serif")
				.attr("font-size", 10)
				.attr("fill", fontColor)
			.selectAll("g")
			.data(data.columns.filter((d,i) => i > 0))
			.join("g")
				.attr("transform", (d, i) => `translate(0,${i * 20})`);
	  
		g.append("rect")
			.attr("x", -19)
			.attr("width", 19)
			.attr("height", 19)
			.attr("fill", d => data.colors[d]);
	  
		g.append("text")
			.attr("x", -24)
			.attr("y", 9.5)
			.attr("dy", "0.35em")
			.text(d => d);
	}

	const tooltip = d3.select("body")
		.append("div")
		.style("position", "absolute")
		.style("z-index", "10")
		.style("visibility", "hidden")
		.style("background", backgroundColor)
		.style("padding", "2px 4px")
		.style("border-radius", "25px");


	const x0 = d3.scaleBand()
		.domain(data.map(d => d[groupKey]))
		.rangeRound([margin.left, width - margin.right])
		.paddingInner(0.1);

	const x1 = d3.scaleBand()
		.domain(keys)
		.rangeRound([0, x0.bandwidth()])
		.padding(0.05);

	const y = d3.scaleLinear()
		.domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()
		.rangeRound([height - margin.bottom, margin.top]);

	const xAxis = g => g
		.attr("transform", `translate(0,${height - margin.bottom})`)
		.call(d3.axisBottom(x0).tickSizeOuter(0))
		.call(g => g.select(".domain").remove())

	const yAxis = g => g
		.attr("transform", `translate(${margin.left},0)`)
		.call(d3.axisLeft(y).ticks(null, "s"))
		.call(g => g.select(".domain").remove())
		.call(g => g.select(".tick:last-of-type text").clone()
			.attr("x", 3)
			.attr("text-anchor", "start")
			.attr("font-weight", "bold")
			.attr("fill", fontColor)
			.text(data.y))

	const svg = d3.create("svg")

	svg.append("g")
		.selectAll("g")
		.data(data)
		.join("g")
			.attr("transform", d => `translate(${x0(d[groupKey])},0)`)
		.selectAll("rect")
		.data(d => keys.map(key => ({key, value: d[key]})))
		.join("rect")
			.attr("x", d => x1(d.key))
			.attr("y", d => {return d.value < midpoint ?  y(midpoint) : y(d.value)})
			.attr("width", x1.bandwidth())
			.attr("height", d => {return d.value < midpoint ? y(d.value) - y(midpoint) : y(midpoint) - y(d.value)})
			.attr("fill", d => d3.rgb(data.colors[d.key]))
			.on("mouseover", d => {
				return tooltip
					.style("visibility", "visible")
					.text(d.value.toFixed(2).replace(/\.?0*$/,''));
			})
			.on("mousemove", () => {
				return tooltip
					.style("top", (d3.event.pageY-10)+"px")
					.style("left",(d3.event.pageX+10)+"px");
			})
			.on("mouseout", () => {
				return tooltip
					.style("visibility", "hidden");
			});

	svg.append("g")
			.call(xAxis);

	svg.append("g")
			.call(yAxis);

	svg.append("g")
			.call(legend);

	return svg.node();
}