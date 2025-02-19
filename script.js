$(document).ready(function () {
	let currentFilter = "all";
	const API_KEY = "1361";

	const getAndDisplayAllTasks = function () {
		$.ajax({
			type: "GET",
			url: "https://fewd-todolist-api.onrender.com/tasks?api_key=" + API_KEY,
			dataType: "json",
			success: function (response) {
				$("#todo-list").empty();

				const filteredTasks = response.tasks.filter((task) => {
					if (currentFilter === "active") return !task.completed;
					if (currentFilter === "completed") return task.completed;
					return true;
				});

				filteredTasks.forEach(function (task) {
					const template = document.querySelector("#task-template");
					const taskElement = template.content.cloneNode(true);

					const taskContent = taskElement.querySelector(".task-content");
					const checkbox = taskElement.querySelector(".mark-complete");
					const deleteButton = taskElement.querySelector(".delete");

					taskContent.textContent = task.content;
					checkbox.checked = task.completed;
					checkbox.dataset.id = task.id;
					deleteButton.dataset.id = task.id;

					if (task.completed) {
						taskContent.classList.add("line-through", "text-gray-400");
					}

					$("#todo-list").append(taskElement);
				});
			},
			error: function (errorMessage) {
				console.log(errorMessage);
			},
		});
	};

	const createTask = function () {
		$.ajax({
			type: "POST",
			url: "https://fewd-todolist-api.onrender.com/tasks?api_key=" + API_KEY,
			contentType: "application/json",
			dataType: "json",
			data: JSON.stringify({
				task: {
					content: $("#new-task-content").val(),
				},
			}),
			success: function () {
				$("#new-task-content").val("");
				getAndDisplayAllTasks();
			},
			error: function (errorMessage) {
				console.log(errorMessage);
			},
		});
	};

	const deleteTask = function (id) {
		$.ajax({
			type: "DELETE",
			url:
				"https://fewd-todolist-api.onrender.com/tasks/" +
				id +
				"?api_key=" +
				API_KEY,
			success: function () {
				getAndDisplayAllTasks();
			},
			error: function (errorMessage) {
				console.log(errorMessage);
			},
		});
	};

	const markTaskComplete = function (id) {
		$.ajax({
			type: "PUT",
			url:
				"https://fewd-todolist-api.onrender.com/tasks/" +
				id +
				"/mark_complete?api_key=" +
				API_KEY,
			dataType: "json",
			success: function () {
				getAndDisplayAllTasks();
			},
			error: function (errorMessage) {
				console.log(errorMessage);
			},
		});
	};

	const markTaskActive = function (id) {
		$.ajax({
			type: "PUT",
			url:
				"https://fewd-todolist-api.onrender.com/tasks/" +
				id +
				"/mark_active?api_key=" +
				API_KEY,
			dataType: "json",
			success: function () {
				getAndDisplayAllTasks();
			},
			error: function (errorMessage) {
				console.log(errorMessage);
			},
		});
	};

	$("#create-task").on("submit", function (e) {
		e.preventDefault();
		createTask();
	});

	$(document).on("click", ".delete", function () {
		deleteTask($(this).data("id"));
	});

	$(document).on("change", ".mark-complete", function () {
		if (this.checked) {
			markTaskComplete($(this).data("id"));
		} else {
			markTaskActive($(this).data("id"));
		}
	});

	$(".filter-btn").on("click", function () {
		$(".filter-btn")
			.removeClass("bg-blue-500 text-white")
			.addClass("text-blue-500 bg-white");
		$(this)
			.removeClass("text-blue-500 bg-white")
			.addClass("bg-blue-500 text-white");

		currentFilter = $(this).data("filter");
		getAndDisplayAllTasks();
	});

	getAndDisplayAllTasks();
});
