from locust import HttpUser, task, between

class LoadTest(HttpUser):
    @task
    def test(self):
        self.client.get('/')