
export function renderRecent() {
  return `
      <!-- Recent Activities -->
      <div id="activity-section" class="mb-5">
        <h2>Recent Activities</h2>
        <div class="card">
          <div class="card-body">
            <ul class="list-group list-group-flush">
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <i class="fas fa-spinner text-success me-2"></i>
                  Project "Clean-up Drive" marked as In Progress
                  <small class="d-block text-muted">by user1</small>
                </div>
                <span class="text-muted">Yesterday</span>
              </li>
              <li class="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <i class="fas fa-file-upload text-info me-2"></i>
                  Report uploaded for "Sports Tournament"
                  <small class="d-block text-muted">by user2</small>
                </div>
                <span class="text-muted">2 days ago</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
  `;
}
